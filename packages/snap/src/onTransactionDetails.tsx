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
  fetchHexMalice,
  fetchExchangeRates,
  fetchTripleVaultPositions,
  generateTriplePositionsTornadoGraphRanges,
  createTornadoGraphSVG,
  fetchHexAtoms,
} from '~/util';
import { CONFIG } from '~/constants/web3';

const queryClient = new QueryClient();

const apiOrigin = CONFIG.REVEL8_API_ORIGIN;
const explorerOrigin = CONFIG.REVEL8_EXPLORER_DOMAIN;

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

  let url = `${explorerOrigin}/rankings/,24793,25202?modal=complete_triple&atomIds=&address=${counterPartyAddress}`;

  // check if atom exists
  const hexAtom = await queryClient.fetchQuery({
    queryKey: ['atom', counterPartyAddress],
    queryFn: async () => (await fetchHexAtoms(counterPartyAddress)).data[0],
  });

  let svgString = '';

  if (hexAtom) {
    console.log('hexAtom exists');
    url = `${explorerOrigin}/rankings/,24793,25202?modal=create_triple&atomIds=${hexAtom.id},24793,25202`;

    const maliceResponse = await queryClient.fetchQuery({
      queryKey: ['malice', counterPartyAddress],
      queryFn: async () => await fetchHexMalice(counterPartyAddress),
    });

    const exchangeRatesResponse = await queryClient.fetchQuery({
      queryKey: ['exchangeRates'],
      queryFn: async () => await fetchExchangeRates(),
    });

    const [maliceData, exchangeRatesData] = await Promise.all([
      maliceResponse,
      exchangeRatesResponse,
    ]);
    const [maliceTriple] = maliceData;
    if (maliceTriple) {
      console.log('maliceTriple exists');
      url = `${explorerOrigin}/triples/${maliceTriple.id}?modal=stake_triple`;

      const { data: vaultPositionsData } = await queryClient.fetchQuery({
        queryKey: ['vaultPositions', maliceTriple.id],
        queryFn: async () => await fetchTripleVaultPositions(maliceTriple.id),
      });

      const rangesFormatted = generateTriplePositionsTornadoGraphRanges({
        exchangeRates: exchangeRatesData,
        triplePositionsData: vaultPositionsData,
      });

      svgString = createTornadoGraphSVG(rangesFormatted, {
        label: 'Malicious',
        valueLabel: '.018 Ξ',
      });
    }
  }

  console.log('onTransactionDetails->return', {
    counterPartyAddress,
    svgString,
    url,
  });

  let image = null;

  if (svgString) {
    image = <Image src={svgString} />;
  }

  return {
    content: (
      <Box>
        <Heading>Actions</Heading>
        <Box>
          <Address address={counterPartyAddress as `0x${string}`} />
          {image}
          <Link href={url}>Report as malicious</Link>
          {/* <Button name="trustworthy">Trustworthy</Button> */}
        </Box>
        {/* <Text>Report</Text>
        <Text>selectedAddress: {selectedAddress}</Text>
        <Text>from: {from}</Text>
        <Text>to: {to}</Text>
        <Text>counterPartyAddress: {counterPartyAddress}</Text>
        <Text>url: {url}</Text> */}
        {/* <Text>Malice: {JSON.stringify(malice)}</Text> */}
      </Box>
    ),
  };
};
