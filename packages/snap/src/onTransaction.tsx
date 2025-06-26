import type { OnTransactionHandler } from "@metamask/snaps-sdk";
import { Box, Heading, Text } from "@metamask/snaps-sdk/jsx";
import axios from "axios";
import { useEffect, useState } from "react";

const baseURL = 'https://api.base-sepolia.revel8.io';

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
  transactionOrigin,
}) => {
  console.log(1, {transaction, chainId, transactionOrigin});
  console.log(2, transaction);
  const { to } = transaction
  let insights: unknown[] = []

  try {
    const url = `${baseURL}/hex/0xCf8626062768d752C01bc1F67CC0deF0cbe71c3A/triples`
    console.log('url', url)
    const {data} = await axios(url)
    console.log('data', data)
    insights = data
  } catch (error) {
    console.error(error)
  }
  
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