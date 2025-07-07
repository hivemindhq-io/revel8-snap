import { type OnViewActivityItemHandler } from '@metamask/snaps-sdk';
import { Box, Heading, Text } from '@metamask/snaps-sdk/jsx';

export const onViewActivityItem: OnViewActivityItemHandler = async () => {
  return {
    content: (
      <Box>
        <Heading>My Signature Insights</Heading>
        <Text>Here are the insights:</Text>
      </Box>
    ),
  };
};
