import CustomTable, { AccessData } from '../../components/shared/CustomTable';

const xcolumns = ['Discord', 'Telegram', 'Google'];

const ycolumns: AccessData[] = [
  { application: 'TogetherCrew', Discord: true, Telegram: false, Google: true },
  { application: 'MeetWith', Discord: true, Telegram: true, Google: false },
  { application: 'Wallet', Discord: false, Telegram: true, Google: true },
];

const data: AccessData[] = ycolumns;

export function Identifiers() {
  return (
    <div>
      <CustomTable xcolumns={xcolumns} ycolumns={ycolumns} data={data} />
    </div>
  );
}

export default Identifiers;
