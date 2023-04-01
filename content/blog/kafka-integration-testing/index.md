---
title: Kafka Integration Testing with Testcontainers
date: "2023-03-01"
description: Use Testcontainers to test Kafka messaging.
thumbnail: "./data-streams.jpg"
tags: ["automation", "testcontainers", "kafka", "integration", "async", "docker", "container"]
pageType: "blog"
---
![Data streams](./data-streams.jpg)

Communication with a message broker is a common practice, used for a variety of reasons, to decouple processing from data producers, to buffer unprocessed messages, etc. One of the most popular message brokers used at the moment is [Kafka](https://kafka.apache.org/). Kafka can also used for other use cases, other than messaging, such as website activity tracking, metrics and log aggregation. In this article I will focus on integration testing with Kafka as a message broker.

Let's take a typical movie catalog service as an example which produces messages to and consumes messages from Kafka topics.
- Producing messages: when a movie is added to the catalog, it also sends a status update to a Kafka topic for other systems to consume.
- Consuming messages: the service consumes from a Kafka topic to get updates on comments

How do integration tests look like to cover both message flows? Integration testing can be done on different levels. Here I will cover testing the service under test as close to production as possible, but without relying on other services, (shared) environments and external dependencies.

We need a couple of things to achieve this:

- The Kafka message broker
- A `KafkaConsumer` that can consume the Kafka message that the service is sending.
- A `KafkaProducer` that can produce a Kafka message to the topic that the service is subscribed to.
- The actual test that triggers functionality on the service which then triggers the Kafka message.
- Another test that produces the Kafka message for the service to consume.

## Kafka with Testcontainers
With [Testcontainers](https://www.testcontainers.org/) it is very easy to programmatically boot up a Docker container without much configuration. In this way the service under test can communicate with the Kafka broker by just configuring the correct url in the service configuration. The simplest example to spin up a Kafka container looks like this:
```java
KafkaContainer kafka = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka"));
```
Yes, that's it. There are obviously more configuration options available (check out the docs), but for this test example, let's use this default setup.

## KafkaConsumer
Here is a simple example of a `KafkaConsumer` used for testing. For demonstration purposes we will use `String` serialization. In practice, specific data serializers are usually used, such as [Avro](https://avro.apache.org/). To test the service under test in isolation, this `KafkaTestConsumer` will simulate the behavior of an actual consumer of the Kafka topic.

```java
public class KafkaTestConsumer {

    private final KafkaConsumer<String, String> consumer;

    public KafkaTestConsumer(String bootstrapServers, String groupId) {
        Properties props = new Properties();

        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");

        this.consumer = new KafkaConsumer<>(props);
    }

    public void subscribe(List<String> topics) {
        consumer.subscribe(topics);
    }

    public ConsumerRecords<String, String> poll() {
        return consumer.poll(Duration.ofSeconds(5));
    }

}
```

## Testing the production of messages
First, the test where we consume the message which the service is sending. Here we subscribe to the topic from the `KafkaTestConsumer`. When we invoke the functionality on the service under test, it will trigger sending the Kafka message. The `KafkaTestConsumer` consumes the topic and finally we can check on the message coming in.

```java
private final KafkaContainer kafka = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka"));

private final ObjectMapper mapper = new ObjectMapper();

@BeforeEach
void startContainer() {
    kafka.start();
}

@Test
void shouldSendStatusUpdate() {
    KafkaTestConsumer kafkaTestConsumer = new KafkaTestConsumer(kafka.getBootstrapServers(), "test_group");

    kafkaTestConsumer.subscribe(singletonList("catalog_topic"));

    String movieId = service.addMovieToCatalog();

    ConsumerRecords<String, String> records = kafkaTestConsumer.poll();

    assertThat(records.count()).isEqualTo(1);

      // As mentioned before, in this example we are using String serializers, in practice it is very common to use Avro schemas to serialize these messages
    records.iterator().forEachRemaining(record -> assertThat(mapper.readValue(record.value(), MovieState.class))
                .isEqualTo(MovieState.builder()
                        .movieId(movieId)
                        .status("CREATED")
                        .build()));
}
```

### KafkaProducer
Very similar to the `KafkaConsumer` above, here is an example of a `KafkaProducer` used for testing which we need to simulate the behavior of an actual producer.

```java
public class KafkaTestProducer {

    private final ObjectMapper mapper = new ObjectMapper();

    private final KafkaProducer<String, String> producer;

    public KafkaTestProducer(String bootstrapServers) {
        Properties props = new Properties();

        props.put(ProducerConfig.ACKS_CONFIG, "all");
        props.put(ProducerConfig.RETRIES_CONFIG, 0);
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());

        this.producer = new KafkaProducer<>(props);
    }

    public void send(String topicName, Object messageObject) {
        producer.send(new ProducerRecord<>(topicName, mapper.writeValueAsString(messageObject));
    }

}
```

## Testing the consumption of messages
For this test on producing a Kafka message for the service to consume, we use the `KafkaTestProducer` to send a message. After sending, we check the processed result on the service under test.

```java
@Test
void shouldProcessComments() {
    KafkaTestProducer kafkaTestProducer = new KafkaTestProducer(kafka.getBootstrapServers());
    String movieId = UUID.randomUUID().toString();

    assertThat(service.getComments(movieId)).isEmpty();

    kafkaTestProducer.send("comments_topic", MovieComment.builder()
                .movieId(movieId)
                .commentId(UUID.randomUUID().toString())
                .status("SUBMITTED")
                .build());

    assertThat(service.getComments(movieId)).hasSize(1);
}
```

You might wonder how to deal with certain delays in the tests. It may take a few seconds before the comments have been updated on the service side.

With [Awaitility](http://www.awaitility.org/) handling asynchronous behavior is a breeze, for example:

```java
await("Polling until comments are received")
  .pollInterval(1, SECONDS)
  .atMost(5, SECONDS)
  .until(() -> !service.getComments(movieId).isEmpty());
```
Here you only need to define the polling times and the condition on which it waits until it is `true`. In case it never evaluates to `true`, it will timeout based on the max timeout specified.

## Conclusion
Testing Kafka messages is made easy with [Testcontainers](https://www.testcontainers.org/). The [Kafka](https://kafka.apache.org/) Docker container is spun up on-the-fly via Testcontainers. Simulating the behavior of other systems can be simply done by creating a `KafkaProducer` or `KafkaConsumer` as part of your test. In this way your service can be completely tested without relying on any other environment or dependencies. Be aware that this type of messaging is asynchronous. To handle this in an easy way from a testing point of view, you can use [Awaitility](http://www.awaitility.org/) instead of implementing your own polling mechanism.
