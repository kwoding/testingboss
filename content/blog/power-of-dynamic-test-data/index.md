---
title: The Power of Dynamic Test Data
date: "2023-02-05T23:09:03.112Z"
description: Use random valid test data to increase test coverage.
thumbnail: "./test-data.jpg"
tags: ["automation", "data", "coverage"]
pageType: "blog"
---
![Network](./test-data.jpg)

In my experience I have seen many tests that run on every commit. Often these unit/integration tests use fixed data, so that the tests are reproducable and stable. That is a good thing, right? Well, not always.

So the great thing about automated tests is that you can run many tests in a very short time. Additionally, you can also run tests with different parameters with a breeze. I have seen many tests running thousand times a day and they always pass, especially due to the fixed data. What if you could catch certain unexpected cases by just using random valid data? This would add more value to an automated test over time.

## A real world example

Let's say we have a Spring Boot application that can perform payments by IBAN number. We enable this payment feature per country for this application by configuration, so that we can easily control this without changing any application code.

Example of the configuration in the `application.yaml` file:

```yaml
countries.enabled:
  - AT
  - BE
  - BR
  - CZ
  - DK
  - DE
  - NL
```

In the application we have the check to make sure that the IBAN number that is used is from one of these countries.

```java
@Value("countries.enabled")
private List<String> enabledCountryCodes;

private boolean isIbanInEnabledCountry(String ibanNumber) {
    String countryCode = ibanNumber.substring(0,2);
    return enabledCountryCodes.contains(countryCode);
}
```

So far so good, right? Well, you can argue about this design, but nevertheless, this is a real world example I have seen in practice.

A test could be as easy as this:

```java
@Test
void shouldValidateIbanNumberInEnabledCountry() {
    assertThat(isIbanInEnabledCountry("NL69RABO1319778291")).isTrue();
}
```

Now, we are expanding the feature with a couple more countries:

```yaml
countries.enabled:
  - AT
  - BE
  - BR
  - CZ
  - DK
  - DE
  - IE
  - IT
  - NL
  - NO
  - PT
```

In this case the test still passes, no worries. Testing every single country is just overkill. The mechanism is quite straightforward, right? Well, if you would test with a Norwegian IBAN number the test would fail:

```java
@Test
void shouldValidateIbanInEnabledCountry() {
    assertThat(isIbanInEnabledCountry("NO9386011117947")).isTrue();
}
```

Why? Maybe the YAML gurus reading this, already know the problem. Let me explain. The value `NO` in the YAML file evaluates to `false`. This means that the String list `enabledCountryCodes` contains the value `false` instead of `NO`. It is easy to fix by putting the `NO` between quotes of course.

Back to the test, how could we utilize the power of dynamic test data in this automated test to catch this somewhat unexpected case? Like I said, it is an overkill to test each single country every time. Imagine having a list of a hundred countries.

Use [javafaker](https://github.com/DiUS/java-faker) or [datafaker](https://github.com/datafaker-net/datafaker) to generate a random valid IBAN number for the list of countries. These libraries are great to generate random valid data, such as names, addresses, URLs, e-mail addresses.

```java
private final Faker faker = Faker.newInstance();

private final Random random = new Random();

@Test
void shouldValidateIbanNumberInEnabledCountry() {
    String iban = faker.finance.iban();
    String enabledCountryCode = enabledCountryCodes.get(random.nextInt(enabledCountryCodes.size()))

    String enabledIban = enabledCountryCode + iban.substring(3);
    assertThat(isIbanInEnabledCountry(enabledIban)).isTrue();
}
```

This way this bug was actually caught in practice.

## Conclusion

Automated tests are great, but when using fixed test data over and over again, the test is obviously reproducable and consistent. However, if you just put random valid data as part of the test, the test is still valid but also increases in value. This is because using valid random data could catch unexpected behavior.
