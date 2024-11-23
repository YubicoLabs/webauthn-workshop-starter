// simple demonstration of the WebAuthn API with a backend RP server
// See README for instructions to run the backend
// run in a recent browser like Chrome over https or http://localhost

// NOTE: in other browsers, you may need some polyfills:
// https://github.com/MasterKale/webauthn-polyfills


// the webauthn API base URI
const api = "http://localhost:8080/v1";
// See http://localhost:8080/swagger-ui/index.html

// convert an ArrayBuffer to a hexstring
function btoh(bin) {
    bytes = new Uint8Array(bin);
    return [...bytes].map(b => b.toString(16).padStart(2, "0")).join("");
}

// post request data as JSON to endpoint and return parsed JSON result
async function post(uri, request) {
    console.log(">> send >>", request);
    params = {
        method: "POST",
        body: JSON.stringify(request),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    };
    httpResponse = await fetch(uri, params);
    response = await httpResponse.json();
    console.log("<< recv <<", response);
    if( httpResponse.status != 200 ) {
        throw new Error("backend error");
    }
    return response;
}

/// REGISTER ///

// retrieve challenge and other options for credentials.get
async function createOptions() {
    body = {
        userName: "john",
        displayName: "John Doe",
        authenticatorSelection: {
            residentKey: "required",
        }
    };
    json = await post(`${api}/attestation/options`, body);
    json.publicKey = PublicKeyCredential.parseCreationOptionsFromJSON(json.publicKey);
    return json;
}

// post response with attestation to backend for registration
async function postAttestation(requestId, attestation) {
    body = {
        requestId: requestId,
        makeCredentialResult: attestation
    };
    json = await post(`${api}/attestation/result`, body);
    return json;
}

// create a credential
async function register() {
    try {
        options = await createOptions();
        requestId = options.requestId;
        attestation = await navigator.credentials.create(options);
        console.log(attestation);
        result = await postAttestation(requestId, attestation);
        if( result.status == "created" ) {
            document.getElementById("message").innerHTML +=
                `<br/>Created credential with ID <span class="code">${ btoh( (attestation.rawId) )}</span>` +
                ` for user ID <span class="code">${ btoh((options.publicKey.user.id)) }</span>`;
        }
    } catch (e) {
        document.getElementById("message").innerHTML += `<br/><b>Registration failed</b>: ${ e.message }`;
    }
}

/// AUTHENTICATE ///

// retrieve challenge and other options for credentials.get
async function getOptions() {
    body = {
        publicKey: {}
    };
    json = await post(`${api}/assertion/options`, body);
    json.publicKey = PublicKeyCredential.parseRequestOptionsFromJSON(json.publicKey);
    return json;
}

// post response with assertion to backend for validation
async function postAssertion(requestId, assertion) {
    body = {
        requestId: requestId,
        assertionResult: assertion
    };
    json = await post(`${api}/assertion/result`, body);
    return json;
}

// get an assertion
async function authenticate() {
    try {
        options = await getOptions();
        requestId = options.requestId;
        assertion = await navigator.credentials.get(options);
        console.log(assertion);
        result = await postAssertion(requestId, assertion);
        document.getElementById("message").innerHTML +=
            `<br/>Obtained assertion for credential ID <span class="code">${ btoh((assertion.rawId)) }</span>` +
            ` and user ID <span class="code">${ btoh((assertion.response.userHandle)) }</span>`;
    } catch (e) {
        document.getElementById("message").innerHTML += `<br/><b>Authentication failed</b>: ${ e.message }`;
    }
}
