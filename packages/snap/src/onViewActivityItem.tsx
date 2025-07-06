import type { OnViewActivityItemHandler } from "@metamask/snaps-sdk";
import { Box, Heading, Text } from "@metamask/snaps-sdk/jsx";
import axios from "axios";

// const baseURL = 'https://api.base-sepolia.revel8.io';
const baseURL = 'http://localhost:3333';

export const onViewActivityItem: OnViewActivityItemHandler = async (props) => {
  console.log('kylan1 onViewActivityItem.tsx props', props);
  const insights = [{ value: 'hello I am kylans snap' }, { value: JSON.stringify(props)}];

  console.log('kylan insights', insights);
  return {
    content: (
      <Box>
        <Heading>My Transaction Insights</Heading>
        <Text>Here are the insights:</Text>
        <Text>hello</Text>
        <Text>{insights.map((item: any) => JSON.stringify(item))}</Text>
      </Box>
    ),
  };
};
