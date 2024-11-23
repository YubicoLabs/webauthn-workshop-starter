# Getting started with WebAuthn

This is a very simple WebAuthn demo that runs entirely in your browser.
There is no validation of generated credentials in this initial version.

To run on your local system:

1. Clone this repository:

    git clone https://github.com/YubicoLabs/webauthn-workshop-starter.git

2. Run a web server so you can access its files on localhost. For instance:

    python3 -m http.server 8000

3. Open [http://localhost:8000/](http://localhost:8000/) in Chrome.

4. Open Developer Tools to monitor logs.

5. Register some passkeys on different authenticators.

Next: See [backend](backend)for instructions on using a backend server for validating passkeys.
