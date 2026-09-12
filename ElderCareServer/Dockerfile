# Build the jar inside the image so the build does not depend on whatever
# happens to be sitting in build/libs on the machine that runs docker build.
FROM eclipse-temurin:21-jdk AS build
WORKDIR /workspace

COPY gradlew gradlew.bat ./
COPY gradle gradle
COPY build.gradle settings.gradle ./

# Resolve dependencies on their own layer so source edits do not invalidate it.
RUN chmod +x gradlew && ./gradlew dependencies --no-daemon || true

COPY src src
RUN ./gradlew bootJar --no-daemon -x test

FROM eclipse-temurin:21-jre AS runtime
WORKDIR /app

# Run as a non root user rather than as root, which is the default.
RUN groupadd --system eldercare && useradd --system --gid eldercare eldercare

COPY --from=build /workspace/build/libs/*.jar app.jar
RUN chown eldercare:eldercare app.jar

USER eldercare
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
