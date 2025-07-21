import { QueryClient } from '@tanstack/react-query';
import {
  OnTransactionHandler,
  type OnTransactionDetailsHandler,
} from '@metamask/snaps-sdk';
import {
  Heading,
  Button,
  Box,
  Text,
  Address,
  Link,
  Image,
} from '@metamask/snaps-sdk/jsx';
import {
  fetchHexMaliciousness,
  fetchExchangeRates,
  fetchTripleVaultPositions,
} from '~/util/fetch';
import { TriplePositionsTornadoMinGraph } from '~/components/TriplePositionsTornadoMinGraph';
import { vaultPositionsToTornadoGraphData } from '~/util/intuition';

const queryClient = new QueryClient();

const apiOrigin = 'http://localhost:56121';
const explorerOrigin = 'https://localhost:3001';

export const onTransaction: OnTransactionHandler = async ({
  transactionMeta,
  origin,
  chainId,
  selectedAddress,
  selectedAccount,
}: {
  transactionMeta: any;
  origin: string;
  chainId: string;
  selectedAddress: string;
  selectedAccount: any;
}) => {
  console.log('kylan2 onTransaction.tsx props', {
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

  console.log('kylan2 before maliciousnessData');
  const maliciousnessData = await queryClient.fetchQuery({
    queryKey: ['maliciousness', counterPartyAddress],
    queryFn: async () => await fetchHexMaliciousness(counterPartyAddress),
  });
  console.log('kylan2 after maliciousnessData');
  const exchangeRatesData = await queryClient.fetchQuery({
    queryKey: ['exchangeRates'],
    queryFn: async () => await fetchExchangeRates(),
  });
  console.log('kylan2 after exchangeRatesData');
  const vaultPositionsData = await queryClient.fetchQuery({
    queryKey: ['vaultPositions', maliciousnessData.id],
    queryFn: async () => await fetchTripleVaultPositions(maliciousnessData.id),
  });
  console.log('kylan2 after vaultPositionsData');
  // check if
  const maliciousnessExplorerLink = `${explorerOrigin}/rankings/,24793,25202?modal=stake-triple&atomIds=&address=${counterPartyAddress}`;
  console.log('kylan2 maliciousnessLink', maliciousnessExplorerLink);
  // const trustworthinessExplorerLink = `${explorerOrigin}/hex/${counterPartyAddress}`;

  // Replace the component rendering with manual SVG generation
  const createChartSvg = (positionsData: any) => {
    const { aggregateData } = vaultPositionsToTornadoGraphData(
      positionsData,
      exchangeRatesData,
    );

    let svgContent = `
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
    `;

    aggregateData.forEach((item: any, index: number) => {
      const barHeight = Math.abs(item.vaultBalance) * 10; // Scale the data
      const yValue = 100 - barHeight;

      svgContent += `
        <rect x="${index * 20}" y="${yValue}" width="15" height="${barHeight}"
              fill="${item.vaultBalance > 0 ? '#31ad31' : '#bc4535'}"/>
      `;
    });

    svgContent += `</svg>`;
    return svgContent;
  };

  const svgString = createChartSvg({
    exchangeRates: exchangeRatesData,
    data: vaultPositionsData,
  });

  // Convert to data URL for the Image component
  const dataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;

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
        <Image src={dataUrl} />
      </Box>
    ),
  };
};
