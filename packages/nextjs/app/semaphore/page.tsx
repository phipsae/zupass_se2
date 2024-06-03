"use client";

import { useCallback, useState } from "react";
import {
  openSemaphoreSignaturePopup,
  usePCDMultiplexer,
  usePendingPCD,
  useSemaphoreSignatureProof,
  useZupassPopupMessages,
} from "@pcd/passport-interface";
//   import { CollapsableCode, HomeLink } from "../../components/Core";
//   import { ExampleContainer } from "../../components/ExamplePage";
//   import { PendingPCDStatusDisplay } from "../../components/PendingPCDStatusDisplay";
import type { NextPage } from "next";

const ZUPASS_URL = "https://zupass.org";
const ZUPASS_SERVER_URL = "https://api.zupass.org";

const Semaphore: NextPage = () => {
  const [zupassPCDStr, zupassPendingPCDStr] = useZupassPopupMessages();
  const [pendingPCDStatus, pendingPCDError, serverPCDStr] = usePendingPCD(zupassPendingPCDStr, ZUPASS_SERVER_URL);
  const pcdStr = usePCDMultiplexer(zupassPCDStr, serverPCDStr);

  const [signatureProofValid, setSignatureProofValid] = useState<boolean | undefined>();
  const onProofVerified = (valid: boolean): void => {
    setSignatureProofValid(valid);
  };

  //   const { signatureProof } = useSemaphoreSignatureProof(pcdStr, onProofVerified);
  const signatureProof = undefined;

  const [messageToSign, setMessageToSign] = useState<string>("");
  const [serverProving, setServerProving] = useState(false);

  return (
    <>
      {/* <HomeLink /> */}
      <h2>Semaphore Signature Proof</h2>
      <p>
        This page shows a working example of an integration with Zupass which requests and verifies a semaphore
        signature from a holder of Zupass.
      </p>
      {/* <ExampleContainer> */}
      <input
        style={{ marginBottom: "8px" }}
        placeholder="Message to sign"
        type="text"
        value={messageToSign}
        onChange={(e): void => setMessageToSign(e.target.value)}
      />
      <br />
      <button
        disabled={signatureProofValid}
        onClick={useCallback(
          () =>
            openSemaphoreSignaturePopup(ZUPASS_URL, window.location.origin + "#/popup", messageToSign, serverProving),
          [messageToSign, serverProving],
        )}
      >
        Request Semaphore Signature
      </button>
      <label>
        <input
          type="checkbox"
          checked={serverProving}
          onChange={(): void => {
            setServerProving((checked: boolean) => !checked);
          }}
        />
        server-side proof
      </label>
      {zupassPendingPCDStr && (
        <>{/* <PendingPCDStatusDisplay status={pendingPCDStatus} pendingPCDError={pendingPCDError} /> */}</>
      )}
      {signatureProof && (
        <>
          <p>Got Semaphore Signature Proof from Zupass</p>

          <p>{`Message signed: ${signatureProof.claim.signedMessage}`}</p>
          {signatureProofValid === undefined && <p>❓ Proof verifying</p>}
          {signatureProofValid === false && <p>❌ Proof is invalid</p>}
          {signatureProofValid === true && <p>✅ Proof is valid</p>}
          {/* <CollapsableCode label="PCD Response" code={JSON.stringify(signatureProof, null, 2)} /> */}
        </>
      )}
      {/* </ExampleContainer> */}
    </>
  );
};

export default Semaphore;
