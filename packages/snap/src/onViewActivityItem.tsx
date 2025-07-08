import { type OnViewActivityItemHandler } from '@metamask/snaps-sdk';
import axios from 'axios';
import { ellipsizeHex } from './util';
import {
  Heading,
  Button,
  Box,
  Text,
  Row,
  Address,
  Link,
} from '@metamask/snaps-sdk/jsx';

const apiOrigin = 'http://localhost:3333';
const explorerOrigin = 'http://localhost:3000';

export const onViewActivityItem: OnViewActivityItemHandler = async ({
  transactionMeta,
  origin,
  chainId,
  selectedAddress,
  selectedAccount,
}) => {
  console.log('kylan2 onViewActivityItem.tsx props', {
    transactionMeta,
    origin,
    chainId,
    selectedAddress,
    selectedAccount,
  });
  const { txParams } = transactionMeta;
  const { from, to } = txParams;

  const counterPartyAddress = selectedAddress === from ? to : from;

  let url = '';
  let data = { nothing: 'here' };
  const getHexMaliciousness = async (hexId: string) => {
    url = `${apiOrigin}/hex/${hexId}/maliciousness`;
    console.log('kylan2 url', url);
    const response = await axios(url);
    data = response.data;
    console.log('kylan2 data', data);
    return data;
  };

  const maliciousness = await getHexMaliciousness(counterPartyAddress);
  const maliciousnessLink = `${explorerOrigin}/rankings/,24793,25202?modal=stake-triple&atomIds=&address=${counterPartyAddress}`;
  console.log('kylan2 maliciousnessLink', maliciousnessLink);
  const trustworthinessLink = `${explorerOrigin}/hex/${counterPartyAddress}`;
  console.log('kylan2 maliciousness', maliciousness);

  return {
    content: (
      <Box>
        <Heading>Actions</Heading>
        <Box>
          <Address address={counterPartyAddress as `0x${string}`} />
          <Link href={maliciousnessLink}>Report as malicious</Link>
          <Button name="trustworthy">Trustworthy</Button>
        </Box>
        <Text>Report</Text>
        <Text>selectedAddress: {selectedAddress}</Text>
        <Text>from: {from}</Text>
        <Text>to: {to}</Text>
        <Text>counterPartyAddress: {counterPartyAddress}</Text>
        <Text>url: {url}</Text>
        <Text>Maliciousness: {JSON.stringify(maliciousness)}</Text>
      </Box>
    ),
  };
};
