---
title: Database Integration Testing with Testcontainers
date: "2023-05-01"
description: Use Testcontainers to test integration with databases.
thumbnail: "./library.jpg"
tags: ["automation", "testcontainers", "database", "integration", "docker", "container"]
pageType: "blog"
---
![Library](./library.jpg)

For database integration testing an in-memory database like H2 is commonly used. However, this does not guarantee that your application actually works properly with the production database, which is not an in-memory database. The H2 database has many limitations as listed [here](https://www.h2database.com/html/advanced.html?search=limitation#limits_limitations) and more importantly the limitations on the compatbility modes described [here](http://www.h2database.com/html/features.html#compatibility). This means that for example a simple DDL script on a real database will not always work on H2 in a compatibility mode.

So an in-memory database has its limitations, but how can we test the integration with a real database? Well, either connect to an actual database which is production-like, or use [Testcontainers](https://www.testcontainers.org/) which we will focus on here. This enables to test the application under test with an actual database locally by basically spinning up a Docker container for the database on-the-fly.

Let's set it up, using MySQL as an example.

First, add the necessary dependencies to the project.

```xml
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>mysql</artifactId>
    <version>${mysql.version}</version>
</dependency>
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>${mysql-connector-j.version}</version>
</dependency>
```

Configure your application to connect to the MySQL container from Testcontainers. In a Spring Boot application it looks like this:
```yml
spring:
  datasource:
    url: jdbc:tc:mysql:///test
```

Finally, use the database container in your test as follows.

```java
private final ContactClient client = new ContactClient();

private final Faker faker = Faker.instance();

private final MySQLContainer<?> mysql = new MySQLContainer<>();

@BeforeEach
void startContainer() {
    mysql.start();
}

@Test
void shouldCreateContactWithRealDatabase() {
    long contactId = faker.random().nextLong();
    Contact contact = Contact.newBuilder()
        .withId(contactId)
        .withLastName(faker.name().lastName())
        .withFirstName(faker.name().firstName())
        .withPhone(faker.phoneNumber().cellPhone())
        .build();

    client.createContact(contact)
        .then()
        .statusCode(201);

    Contact actualContact = client.getContact(contactId);

    assertThat(actualContact).isEqualTo(contact);
}
```
Note: this test is based on the [Client-Test Model](/blog/client-test-model-for-rest-api-testing/).

The database container will be spun up before the test and shut down after it.

A few built-in features from Testcontainers that are noteworthy:
- You can set a specific Docker image and tag in the constructor of `MySQLContainer` (similarly for any other database).
- To create tables with a DDL script when creating the database container, it can be specified like this: `new MySQLContainer<>().withInitScript("init.ddl")`.
- It is possible to keep the container alive by utilizing the "reuse" feature from Testcontainers so that you can analyze the actual database state after the test. Create a `testcontainers.properties` file on the classpath with `testcontainers.reuse.enable=true` as contents.

# Conclusion

[Testcontainers](https://www.testcontainers.org/) can be used to test the integration of your application with a real database without relying on a full-blown testing environment. This makes it easy to test this integration locally and on CI pipelines. 