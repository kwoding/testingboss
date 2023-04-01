---
title: OpenAPI Client Code Generation
date: "2023-04-01"
description: Reduce code maintenance by OpenAPI client generation.
thumbnail: "./code.jpg"
tags: ["automation", "testcontainers", "kafka", "integration", "async", "docker", "container"]
pageType: "blog"
---
![Code](./code.jpg)

The OpenAPI Specification (OAS) defines a standard, language-agnostic interface to HTTP APIs which is the de facto standard in the industry. To increase productivity with OAS, there is a collection of [OpenAPI tools](https://openapitools.org/) available. A common use case is utilizing the [OpenAPI generators](https://github.com/OpenAPITools/openapi-generator) to generate the http clients in order to communicate with the APIs. This is a great next step in following the [Client-Test Model](https://testingboss.com/blog/client-test-model-for-rest-api-testing/).

What it means is that you do not need to write any http client code when using an OpenAPI client generator.

## OpenAPI specification

First, we need an OpenAPI specification obviously. Let's take this one as an example, a simple API to create contacts and to retrieve a contact.

```json
{
  "openapi": "3.0.1",
  "info": { "title": "OpenAPI definition", "version": "1.0.0" },
  "paths": {
    "/contacts/{id}": {
      "get": {
        "summary": "Retrieve contact",
        "operationId": "retrieveContact",
        "parameters": [ { "name": "id", "in": "path", "required": true, "schema": { "type": "integer", "format": "int64" } } ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Contact"} } }
         }
        }
      }
    },
    "/contacts": {
      "post": {
        "summary": "Create contact",
        "operationId": "createContact",
        "requestBody": {
          "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Contact"} } },
          "required": true
        },
        "responses": {
          "201": {
            "description": "Successful operation",
            "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ContactPostResponseBody" } } }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Contact": {
        "required": [ "firstName", "lastName", "email" ],
        "type": "object",
        "properties": {
          "id": { "type": "integer", "format": "int64" },
          "lastName": { "type": "string"},
          "firstName": { "type": "string"},
          "phone": { "type": "string"},
          "email": { "type": "string"}
      },
      "ContactPostResponseBody": {
        "type": "object",
        "properties": {
          "id": { "type": "integer", "format": "int64"}
        }
      }
    }
  }
 }
}
```

## Configure the OpenAPI generator

Next, add the plugin to your project and configure it. Using the popular [Rest Assured](https://rest-assured.io/) as library as an example here. Other http clients are also available, such as http clients from Apache, Spring and OkHttp.

```xml
<plugin>
    <groupId>org.openapitools</groupId>
    <artifactId>openapi-generator-maven-plugin</artifactId>
    <version>${openapi-generator-maven-plugin.version}</version>
    <executions>
        <execution>
            <goals>
                <goal>generate</goal>
            </goals>
            <configuration>
                <!-- this can also be a remote URL -->
                <inputSpec>${project.basedir}/src/test/resources/oas.json</inputSpec>
                <output>${project.build.directory}/generated-sources/openapi-generator</output>
                <generatorName>java</generatorName>
                <configOptions>
                    <!-- Java 8 Native JSR310 (preferred for JDK 1.8+) -->
                    <dateLibrary>java8</dateLibrary>
                    <serializationLibrary>jackson</serializationLibrary>
                </configOptions>
                <library>rest-assured</library>
                <skipValidateSpec>true</skipValidateSpec>
                <skipIfSpecIsUnchanged>false</skipIfSpecIsUnchanged>
                <apiPackage>${default.package}.api</apiPackage>
                <modelPackage>${default.package}.model</modelPackage>
            </configuration>
        </execution>
    </executions>
</plugin>
```

The generated client code uses specific annotations, therefore you need to add the required dependencies in your project as follows.

```xml
<dependency>
    <groupId>org.openapitools</groupId>
    <artifactId>jackson-databind-nullable</artifactId>
    <version>${jackson-databind-nullable.version}</version>
</dependency>
<dependency>
    <groupId>javax.annotation</groupId>
    <artifactId>javax.annotation-api</artifactId>
    <version>${javax.annotation-api.version}</version>
</dependency>
<dependency>
    <groupId>com.google.code.findbugs</groupId>
    <artifactId>jsr305</artifactId>
    <version>${jsr305.version}</version>
</dependency>
```

## Utilize the generated client and models

After building the project the generated client is available and can be used. It looks out-of-the-box like this. This also includes generated models which makes it easy to contract the request and response bodies.

```java
@Test
void shouldUseGeneratedApiClient() {
    ApiClient api = ApiClient.api(ApiClient.Config.apiConfig()
                    .reqSpecSupplier(() -> new RequestSpecBuilder()
                            .addFilter(new RequestLoggingFilter())
                            .addFilter(new ResponseLoggingFilter())
                            .setBaseUri("http://localhost:8080")));

    ContactApi.CreateContactOper contact = api.contact().createContact()
            .body(new Contact()
                    .firstName("James")
                    .lastName("Bond")
                    .email("james@bond.com"));

    ContactPostResponseBody responseBody = contact.executeAs(response -> response
            .then()
            .statusCode(200)
            .extract()
            .response());

    assertThat(responseBody).isEqualTo(expectedResponseBody);
}
```

The models also include annotations on whether a field can be nullable. By using the generated clients and models you will follow the OpenAPI contract automatically which takes away the concern on whether the requests and responses are contract compliant.

## Customizing generated code

The generated code is based on [Mustache](https://mustache.github.io/) templates. For Rest Assured you can find the templates [here](https://github.com/OpenAPITools/openapi-generator/tree/master/modules/openapi-generator/src/main/resources/Java/libraries/rest-assured). It is possible to create your own Mustache templates and pass it to the generator. Specify the location of the custom templates in the generator configuration and you are good to go!

```xml
<configuration>
    (...)
    <templateDirectory>${project.basedir}/src/main/resources/tеmplates</templateDirectory>
</configuration>
```

## Conclusion
By using OpenAPI client generator it makes it easy to follow the [Client-Test Model](/blog/client-test-model-for-rest-api-testing/). In addition to that, it heavily reduces the code maintenance on the clients and models. With this approach there is one source of truth, the OpenAPI specification (OAS). This approach will make sure you will follow the OAS contract by code. To further customize the generated code you can write your own [Mustache](https://mustache.github.io/) templates.
