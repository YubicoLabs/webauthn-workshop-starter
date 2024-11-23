# A Backend server for passkeys

To register passkeys and let users authenticate with them, we'll need a backend server.

One option to build such a server is [java-webauthn-server](https://github.com/Yubico/java-webauthn-server).
We have built a simple backend server with a REST API for registration and validation of passeys as part of our
[passkeys workshop](https://github.com/Yubicolabs/passkey-workshop).

To use this backend with our simple WebAuthn demo, proceed as follows:

1. Pull the backend docker image from Docker Hub.

```
docker pull joostvandijk327/demos:passkey_services
```

2. Run the backend in a container.


```
docker run --rm --name rp \
	-e RP_NAME=Demo \
	-e RP_ID=localhost \
	-e RP_ALLOWED_ORIGINS=localhost:8000 \
	-e RP_ALLOWED_CROSS_ORIGINS=localhost:8000 \
	-e RP_ATTESTATION_TRUST_STORE=mds \
	-e RP_ATTESTATION_PREFERENCE=DIRECT \
	-e RP_ALLOW_UNTRUSTED_ATTESTATION=true \
	-e DATABASE_TYPE=local \
	-p 8080:8080 \
	joostvandijk327/demos:passkey_services 
```

3. Check if the backend is alive.

```
curl -s http://localhost:8080/v1/status
```

4. Inspect the API using your browser at [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

5. Again, run a web server so you can access its files on localhost. For instance:

```
python3 -m http.server 8000
```

6. Open [http://localhost:8000/](http://localhost:8000/) in Chrome.

The extended `credentials.js` file in the directory uses the backend to register credentials and verify assertion signatures.
