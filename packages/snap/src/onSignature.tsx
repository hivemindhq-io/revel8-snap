import { OnSignatureHandler, SeverityLevel } from "@metamask/snaps-sdk";
import { Box, Heading, Text } from "@metamask/snaps-sdk/jsx";

export const onSignature: OnSignatureHandler = async ({
  signature,
  signatureOrigin,
}) => {
  console.log('onSignature', {signature, signatureOrigin});
  return {
    content: (
      <Box>
        <Heading>My Signature Insights</Heading>
        <Text>Here are the insights:</Text>
      </Box>
    ),
    severity: SeverityLevel.Critical,
  };
};
