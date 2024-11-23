
const ES256 = -7; // ECDSA w/ SHA-256
const RS256 = -257; // RSA w/ SHA-256

const algo = { name: "ECDSA", namedCurve: "P-256", hash: { name: "SHA-256" } };

const userID = new Uint8Array(16);
self.crypto.getRandomValues(userID); // generate a random user ID

const challenge = new Uint8Array(32);

// convert an ArrayBuffer to a hexstring
function btoh(bin) {
    bytes = new Uint8Array(bin);
    return [...bytes].map(b => b.toString(16).padStart(2, "0")).join("");
}

/// REGISTER ///

const createCredentialDefaultArgs = {
    publicKey: {
        rp: {
            name: "Example Relying Party"
        },
        user: {
            id: userID.buffer,
            name: "deleteMe",
            displayName: "John Doe"
        },
        pubKeyCredParams: [
            { type: "public-key", alg: ES256 },
            { type: "public-key", alg: RS256 }
        ],
        authenticatorSelection: {
          residentKey: "required",
        },
        excludeCredentials: [],
        challenge: challenge.buffer
    }
};

// retrieve challenge and other options for credentials.get
function createOptions() {
    self.crypto.getRandomValues(challenge);
    return createCredentialDefaultArgs;
}

// create a credential
async function register() {
    try {
        options = createOptions();
        attestation = await navigator.credentials.create(options);
        console.log(attestation);
	// prevent re-registration on the same authenticator:
        createCredentialDefaultArgs.publicKey.excludeCredentials.push( {id: attestation.rawId, type: "public-key"} );
	// TODO: store credential on backend
        document.getElementById("message").innerHTML +=
            `<br/>Created credential with ID <span class="code">${ btoh( (attestation.rawId) )}</span>` +
            ` for user ID <span class="code">${ btoh((options.publicKey.user.id)) }</span>`;
    } catch (e) {
        document.getElementById("message").innerHTML += `<br/><b>Registration failed</b>: ${ e.message }`;
    }
}

/// AUTHENTICATE ///

const getCredentialDefaultArgs = {
    publicKey: {
        challenge: challenge.buffer
    },
};

// retrieve challenge and other options for credentials.get
async function getOptions() {
    self.crypto.getRandomValues(challenge);
    return getCredentialDefaultArgs;
}

// get an assertion
async function authenticate() {
    try {
        options = await getOptions();
        assertion = await navigator.credentials.get(options);
        console.log(assertion);
	// TODO: send assertion to backend for validation
        document.getElementById("message").innerHTML +=
            `<br/>Obtained assertion for credential ID <span class="code">${ btoh((assertion.rawId)) }</span>` +
            ` and user ID <span class="code">${ btoh((assertion.response.userHandle)) }</span>`;
    } catch (e) {
        document.getElementById("message").innerHTML += `<br/><b>Authentication failed</b>: ${ e.message }`;
    }
}
