import { useEffect, useState } from 'react';
import { FaDiscord, FaGoogle } from 'react-icons/fa';
import { useReadContract } from 'wagmi';
import { Address } from 'viem';
import sepoliaChain from '../../utils/contracts/app/sepoliaChain.json';
import CustomTable, {
  AccessData,
  Platform,
} from '../../components/shared/CustomTable';

const xcolumns: Platform[] = [
  { name: 'Discord', icon: <FaDiscord /> },
  { name: 'Google', icon: <FaGoogle /> },
];

export function Permissions() {
  const [applications, setApplications] = useState<AccessData[]>([]);

  const {
    data: contractData,
    isLoading,
    isError,
  } = useReadContract({
    abi: sepoliaChain.appContractABI,
    address: sepoliaChain.appContractAddress as Address,
    functionName: 'getApplications',
    args: [0, 10],
  });

  useEffect(() => {
    if (contractData) {
      console.log({ contractData });

      // Map the contract data to match your AccessData structure
      const mappedApplications: AccessData[] = contractData.map(
        (app: { name: string; account: string }) => ({
          application: app.name,
          Discord: false,
          Google: false,
        })
      );
      setApplications(mappedApplications);
    }
  }, [contractData]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <div>
      <CustomTable
        xcolumns={xcolumns}
        ycolumns={applications}
        data={applications}
      />
    </div>
  );
}
