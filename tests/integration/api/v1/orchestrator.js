import retry from "async-retry";  


async function waitForAllServices() {
  await waitForWebService();
}

async function waitForWebService() {
  return retry(fetchStatusEndPoint, {
    retries: 100, 
    maxTimeout: 1000, 
    minTimeout: 100, 
  });
}

async function fetchStatusEndPoint(){
  const response = await fetch('http://localhost:3000/api/v1/status');

  if (!response.ok) {
    throw new Error(`Web service is not ready. Status: ${response.status}`);
  }

}
export default {
  waitForAllServices,
}
