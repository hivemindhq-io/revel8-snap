import type { OnTransactionHandler } from "@metamask/snaps-sdk";
import { Box, Heading, Text } from "@metamask/snaps-sdk/jsx";
import axios from "axios";
import { useEffect, useState } from "react";

// const baseURL = 'https://api.base-sepolia.revel8.io';
const baseURL = 'http://localhost:3333';

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
  transactionOrigin,
}) => {
  console.log('kylan2 onTransaction', {
    transaction,
    chainId,
    transactionOrigin,
  });
  const { to } = transaction;
  let insights: unknown[] = [];

  try {
    const url = `${baseURL}/hex/${to}/triples`;
    console.log('kylan url', url);
    const { data } = await axios(url);
    console.log('kylan data', data);
    insights = data;
  } catch (error) {
    console.error(error);
  }

  console.log('kylan insights', insights);
  return {
    content: (
      <Box>
        <Heading>My Transaction Insights</Heading>
        <Text>Here are the insights:</Text>
        <Text>hello</Text>
        <Text>{insights.map((triple: any) => JSON.stringify(triple))}</Text>
      </Box>
    ),
  };
};
