import CustomTable, { AccessData, Platform } from '../../components/shared/CustomTable';
import { FaDiscord, FaTelegram, FaGoogle } from 'react-icons/fa';

const xcolumns: Platform[] = [
  { name: 'Discord', icon: <FaDiscord /> },
  { name: 'Telegram', icon: <FaTelegram /> },
  { name: 'Google', icon: <FaGoogle /> },
];

const ycolumns: AccessData[] = [
  { application: 'TogetherCrew', Discord: true, Telegram: false, Google: true },
  { application: 'MeetWith', Discord: true, Telegram: true, Google: false },
  { application: 'Wallet', Discord: false, Telegram: true, Google: true },
];

const data: AccessData[] = ycolumns;

export function Permissions() {
  return (
    <div>
      <CustomTable xcolumns={xcolumns} ycolumns={ycolumns} data={data} />
    </div>
  );
}
