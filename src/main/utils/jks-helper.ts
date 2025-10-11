import tinnoveCertJks from '../../../resources/jks/one-cert.jks?asset';

interface CertJks {
  value: string;
  label: string;
  path: string;
}

const certJksList: CertJks[] = [
  {
    value: 'tinnove',
    label: '梧桐系',
    path: tinnoveCertJks,
  },
];

export const getJks = (type: string): CertJks => {
  return certJksList.find((item) => item.value === type)!;
};

export default certJksList;
