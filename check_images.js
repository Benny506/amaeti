import https from 'https';

const fashionImageIds = [
  '1490481651871-ab68de25d43d', '1515886657613-9f3515b0c78f', '1509319117193-57bab727e09d',
  '1539109136881-3be0616acf4b', '1513094735237-8f2714d57c13', '1503342217505-b0a15ec3261c',
  '1483985988355-763728e1935b', '1551232864-3f0890e580d9', '1520006403909-838d6b92c22e',
  '1445205170230-053b83016050', '1512436991641-6745cdb1723f', '1507679799987-c73779587ccf',
  '1485968579580-b6d095142e6e', '1469334031218-e382a71b716b', '1492707892479-7bc8d5a4ee93'
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve(res.statusCode);
    }).on('error', (e) => {
      resolve(e.message);
    });
  });
}

async function run() {
  for (const id of fashionImageIds) {
    const url = `https://images.unsplash.com/photo-${id}?q=80&w=1200&auto=format&fit=crop`;
    const status = await checkUrl(url);
    console.log(`ID ${id} - Status: ${status}`);
  }
}

run();
