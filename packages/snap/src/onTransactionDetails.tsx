import { QueryClient } from '@tanstack/react-query'
import { type OnTransactionDetailsHandler } from '@metamask/snaps-sdk';
import {
  Heading,
  Button,
  Box,
  Text,
  Address,
  Link,
  Image
} from '@metamask/snaps-sdk/jsx';
import {
  fetchHexMaliciousness,
  fetchExchangeRates,
  fetchTripleVaultPositions,
  generateTriplePositionsTornadoGraphRanges,
  createTornadoGraphSVG
} from '~/util';

// import { renderToString } from 'react-dom/server';

const queryClient = new QueryClient()

const apiOrigin = 'http://localhost:56121';
const explorerOrigin = 'https://localhost:3001';

export const onTransactionDetails: OnTransactionDetailsHandler = async ({
  transactionMeta,
  origin,
  chainId,
  selectedAddress,
  selectedAccount,
}) => {
  console.log('kylan2 onTransactionDetails.tsx props', {
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

  console.log('kylan1 before maliciousnessData');
  const maliciousnessData = await queryClient.fetchQuery({
    queryKey: ['maliciousness', counterPartyAddress],
    queryFn: async () => await fetchHexMaliciousness(counterPartyAddress),
  });
  console.log('kylan1 after maliciousnessData');
  const exchangeRatesData = await queryClient.fetchQuery({
    queryKey: ['exchangeRates'],
    queryFn: async () => await fetchExchangeRates(),
  });
  console.log('kylan1 after exchangeRatesData');
  const { data: vaultPositionsData} = await queryClient.fetchQuery({
    queryKey: ['vaultPositions', maliciousnessData.id],
    queryFn: async () => await fetchTripleVaultPositions(maliciousnessData.id),
  });
  console.log('kylan1 after vaultPositionsData', vaultPositionsData);
  // check if
  const maliciousnessExplorerLink = `${explorerOrigin}/rankings/,24793,25202?modal=stake-triple&atomIds=&address=${counterPartyAddress}`;
  console.log('kylan1 maliciousnessLink', maliciousnessExplorerLink);
  const trustworthinessExplorerLink = `${explorerOrigin}/hex/${counterPartyAddress}`;

  const rangesFormatted = generateTriplePositionsTornadoGraphRanges({
    exchangeRates: exchangeRatesData,
    triplePositionsData: vaultPositionsData,
  });

  const svgString = createTornadoGraphSVG(rangesFormatted);
  console.log('kylan1 rangesFormatted', JSON.stringify(rangesFormatted, null, 2));

  return {
    content: (
      <Box>
        <Heading>Actions</Heading>
        <Box>
          <Address address={counterPartyAddress as `0x${string}`} />
          <Link href={maliciousnessExplorerLink}>Report as malicious</Link>
          <Button name="trustworthy">Trustworthy</Button>
        </Box>
        <Text>Report</Text>
        <Text>selectedAddress: {selectedAddress}</Text>
        <Text>from: {from}</Text>
        <Text>to: {to}</Text>
        <Text>counterPartyAddress: {counterPartyAddress}</Text>
        <Text>url: {url}</Text>
        {/* <Text>Maliciousness: {JSON.stringify(maliciousness)}</Text> */}
        <Image src={svgString} />
      </Box>
    ),
  };
};
