import { Box, Button, Flex, SimpleGrid, ChakraProvider, VStack, Heading, FormControl, FormLabel, Stack, Radio, RadioGroup, Image } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import NftMinter from './abis/NftMinter.json';
const { ethers } = require("ethers");

const CONTRACT_ABI = NftMinter.abi; 
const CONTRACT_ADDRESS = '0x20D401efD0085Da28922A51da8aDA4e81A3ae6Aa'; 
const LONDON_NFT = "https://arweave.net/nCyS_voplJ1_B5R8AW78BkFimDPgCOpIrzQIgdb_wDY";
const DUBAI_NFT = "https://arweave.net/K6Q3pDsc-QaOsUD49dnyh5ECvEMvN8Oz2motfU9-w-0";
const LA_NFT = 'https://arweave.net/IXM_CMPJ9U4GUj_nBND_2nyevId-BjNz4GUWcuw3nU0';



function App() {

  const [contractInstance, setContractInstance] = useState(null); 
  const [event, setEvent] = useState("London");
  const [account, setAccount] = useState('');
  const [totalNfts, setTotalNfts] = useState(0);
  const [mintedNfts, setMintedNfts] = useState([]);

  const web3Handler = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
      
    try {

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        console.log("Already connected to MetaMask.");
      } else {
        // No accounts connected, so request access
        const requestedAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(requestedAccounts[0]);
        console.log("MetaMask connected successfully!");
      }
    }
    catch (error) {
      if (error.code === -32002) {
        console.error("A connection request is already pending. Please wait.");
      } else {
        console.error(error);
      } 
    } 
      
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    setContractInstance(contract);
    console.log("Smart contract instance created: ", contract);

    const totalNftCount = await contract.getTotalNftCount();
    setTotalNfts(totalNftCount);
    console.log("Total number of NFTs: ", totalNfts);

    const fetchedNfts = [];
    for (let i = 0; i < totalNftCount; i++) {
      const [owner, tokenId, tokenURI] = await contract.getNft(i);
      fetchedNfts.push({ owner, tokenId, tokenURI });
    }
    setMintedNfts(fetchedNfts);
  };


  useEffect(() => {
    web3Handler();

    window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
      });
    }, []);

  const mint = async () => {
    let eventDetails;
      if (event === "London") {
        eventDetails = LONDON_NFT;
      } else if (event === "Dubai") {
        eventDetails = DUBAI_NFT;
      } else {
        eventDetails = LA_NFT;
      }
    contractInstance.safeMint(account, eventDetails);
  };

  return (
    <Box>
      <ChakraProvider>
      <Box 
        p={8} 
        bg="blue.200" 
        color="black" 
        textAlign="center" 
        borderRadius="md" 
        maxW="100%" 
        mx="auto" 
        boxShadow="lg"
      >
        
        <Heading>Mint an NFT as a Proof of Attendance</Heading>
        </Box>
    </ChakraProvider>

<ChakraProvider>
  <Box
    p={8} 
    color="black" 
    textAlign="center" 
    borderRadius="md" 
    maxW="1800px" 
    mx="auto"
  >
    <VStack p={4} spacing={4} w="70%">
        <Flex>
          <FormControl as='fieldset'>
            <FormLabel as='legend'>Select an event</FormLabel>
            <RadioGroup onChange={setEvent} value={event}>
              <Stack direction = 'row' spacing={20}>
                <Radio value='London'>Fundraiser Gala in London</Radio>
                <Radio value='Dubai'>Sunset Dinner in Dubai</Radio>
                <Radio value='LA'>Summer Launch in Los Angeles</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
        </Flex>

        <Button onClick={mint}>Mint!</Button>
      </VStack>
      </Box>

      </ChakraProvider>

    <ChakraProvider>
    {mintedNfts.length > 0 ? (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={10} justifyContent='center'>
            {mintedNfts.map((e, i) => {
              return (
                <Flex
                  flexDir='column'
                  color="black"
                  bg="white"
                  w='100%'
                  key={e.id}
                  justifyContent="center"
                  alignItems='center'
                  textAlign="center"
                >
                  <Box bg="gray.100" p={4} borderRadius="md" boxShadow="md" fontSize="10px">
                  <Box>
                    <b>Owner</b> {mintedNfts[i].owner}&nbsp;
                  </Box>
                  <Box>
                    <b>Token Id:</b> {mintedNfts[i].tokenId.toString()}&nbsp;
                    
                  </Box>
                  <Image src={mintedNfts[i].tokenURI} />
                  </Box>
                </Flex>
              );
            })}
          </SimpleGrid>
        ) : (
          ''
      )}
    </ChakraProvider>

    </Box>
  );
}

export default App;
