const genderMap = {
  male: '先生',
  female: '小姐',
};

export default function formatGender(gender) {
  return genderMap[gender] || ''
}
