import requests
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

# Target URL to test
URL = "http://192.168.1.35:5173"

# How many total requests to send in the load test
TOTAL_REQUESTS = 10000
# How many requests to send per batch
BATCH_SIZE = 1000
# Delay between each batch (seconds)
DELAY_BETWEEN_BATCHES = 1


def send_request(session, request_id):
    try:
        response = session.get(URL, timeout=5)
        print(f"[{request_id}] Status: {response.status_code}")
    except Exception as e:
        print(f"[{request_id}] Failed: {e}")


def run_load_test():
    request_counter = 1
    with requests.Session() as session:
        for batch_start in range(0, TOTAL_REQUESTS, BATCH_SIZE):
            print(f"\n🚀 Sending batch: {batch_start + 1} to {batch_start + BATCH_SIZE}")
            with ThreadPoolExecutor(max_workers=BATCH_SIZE) as executor:
                futures = [
                    executor.submit(send_request, session, request_counter + i)
                    for i in range(BATCH_SIZE)
                ]
                for future in as_completed(futures):
                    pass
            request_counter += BATCH_SIZE
            time.sleep(DELAY_BETWEEN_BATCHES)


if __name__ == "__main__":
    run_load_test()
