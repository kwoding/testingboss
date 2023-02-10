---
title: Client-Test Model for REST API Testing
date: "2023-01-02T22:12:03.284Z"
description: Use client-test model for separation of concerns for REST API testing.
thumbnail: "./api.jpg"
tags: ["automation", "api", "food"]
pageType: "blog"
---

![Network](./api.jpg)

The separation of concerns is a great coding principle to separate code into distinct sections, each having a separate concern. So let's apply this to test code when writing REST API tests.

Let's say we have a address book service that have APIs to perform CRUD operations (create/update/read/delete).

For example:

- GET `/contacts/{contactId}` to retrieve details of a single contact
- POST `/contacts` to create a contact

With [Rest Assured](https://rest-assured.io/) we can create a contact in a test as follows.

```java
@Test
void shouldCreateContact() {
    Contact contact = Contact.newBuilder()
        .withLastName("Bond")
        .withFirstName("James")
        .withPhone("202-555-0185")
        .build();

    given()
        // Log all requests and responses
        .log().all()
        .baseUri("http://localhost:8080/contacts")
        .contentType(ContentType.JSON)
        .when()
        .body(contact)
        .post()
        .then()
        .statusCode(201);
}
```

## The client-test model

Pretty straightforward, right? Yes, but usually when you have more tests, you would like to prevent setting up all this configuration to perform the actual http request for every test.

Let's refactor this with the client-test model:

- The client will contain all configuration to perform http requests
- The test will focus on the test itself (actions, assertions)

This setup is a clear separation of concerns.

First, set up a base client that contain common configuration.

```java
public abstract class BaseClient {

    private String baseUri;

    public BaseClient(String baseUri) {
        this.baseUri = baseUri;
    }

    public RequestSpecification requestSpec() {
        RestAssuredConfig config = RestAssured.config()
            .httpClient(httpClientConfig().setParam("http.connection.timeout", 10000));

        RequestSpecification requestSpecification = RestAssured.with()
            .config(config)
            // Logging each request and response
            .filter(new ResponseLoggingFilter())
            .filter(new RequestLoggingFilter())
            .baseUri(this.baseUri);

        setLoggingFilters(requestSpecification);

        return requestSpecification;
    }
}
```

Note: this example is simplified, more configuration can be added, e.g. for (de)serializing objects.

Now, create a `ContactClient` that handles the actual http requests.

```java
public class ContactClient extends BaseClient {

    private static final String CONTACTS = "/contacts";

    public ContactClient() {
        super(BASE_URI);
    }

    public Response createContact(Contact contact) {
        return requestSpec()
            .contentType(JSON)
            .body(contact)
            .post(CONTACTS);
    }

    public Response getContact(Long contactId) {
        return requestSpec()
            .contentType(JSON)
            .get(CONTACTS  + "/" + contactId);
    }
}
```

OK, back to the test. In the example below, the test is not polluted by any configuration about the http communication, but focused on the actual steps/actions and assertions.

```java
private final ContactClient client = new ContactClient();

@Test
void shouldCreateContact() {
    Contact contact = Contact.newBuilder()
        .withLastName("Bond")
        .withFirstName("James")
        .withPhone("202-555-0185")
        .build();

    client.createContact(contact)
        .then()
        .statusCode(201);
}
```

## Conclusion

The separation of concerns is a great coding principle which, just like any other good coding principles, should be applied to test code. When implementing REST API tests, a logical separation is that the test only contains the steps/actions and assertions. The part to perform the actual http requests can be abstracted into a so-called client. In this way, the tests are concise and the client(s) are easily extendible and reusable in other tests.
