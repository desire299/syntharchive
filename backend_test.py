import requests
import sys
from datetime import datetime

class SynthAPITester:
    def __init__(self, base_url="https://synth-downloads.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                self.test_results.append({"test": name, "status": "PASS", "details": f"Status: {response.status_code}"})
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.test_results.append({"test": name, "status": "FAIL", "details": f"Expected {expected_status}, got {response.status_code}"})

            return success, response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout")
            self.test_results.append({"test": name, "status": "FAIL", "details": "Request timeout"})
            return False, {}
        except requests.exceptions.ConnectionError:
            print(f"❌ Failed - Connection error")
            self.test_results.append({"test": name, "status": "FAIL", "details": "Connection error"})
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.test_results.append({"test": name, "status": "FAIL", "details": str(e)})
            return False, {}

    def test_root_endpoint(self):
        """Test API root endpoint"""
        success, response = self.run_test(
            "API Root",
            "GET",
            "",
            200
        )
        return success

    def test_seed_database(self):
        """Test database seeding"""
        success, response = self.run_test(
            "Seed Database",
            "POST",
            "synths/seed",
            200
        )
        if success and isinstance(response, dict):
            print(f"   Seed response: {response.get('message', 'No message')}")
            if 'count' in response:
                print(f"   Synths count: {response['count']}")
        return success

    def test_get_all_synths(self):
        """Test getting all synths"""
        success, response = self.run_test(
            "Get All Synths",
            "GET",
            "synths",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} synths")
            if len(response) > 0:
                synth = response[0]
                required_fields = ['id', 'name', 'description', 'price', 'type', 'category', 'website_url', 'features', 'image_url', 'compatibility']
                missing_fields = [field for field in required_fields if field not in synth]
                if missing_fields:
                    print(f"   ⚠️  Missing fields in synth data: {missing_fields}")
                else:
                    print(f"   ✅ All required fields present")
        return success, response if success else []

    def test_filter_free_synths(self):
        """Test filtering free synths"""
        success, response = self.run_test(
            "Filter Free Synths",
            "GET",
            "synths",
            200,
            params={"type": "free"}
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} free synths")
            # Verify all returned synths are actually free
            non_free = [s for s in response if s.get('type') != 'free']
            if non_free:
                print(f"   ⚠️  Found {len(non_free)} non-free synths in free filter")
            else:
                print(f"   ✅ All synths are correctly filtered as free")
        return success

    def test_filter_paid_synths(self):
        """Test filtering paid synths"""
        success, response = self.run_test(
            "Filter Paid Synths",
            "GET",
            "synths",
            200,
            params={"type": "paid"}
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} paid synths")
            # Verify all returned synths are actually paid
            non_paid = [s for s in response if s.get('type') != 'paid']
            if non_paid:
                print(f"   ⚠️  Found {len(non_paid)} non-paid synths in paid filter")
            else:
                print(f"   ✅ All synths are correctly filtered as paid")
        return success

    def test_search_functionality(self):
        """Test search functionality"""
        # Test search for "Serum"
        success1, response1 = self.run_test(
            "Search for 'Serum'",
            "GET",
            "synths",
            200,
            params={"search": "Serum"}
        )
        
        # Test search for "Vital"
        success2, response2 = self.run_test(
            "Search for 'Vital'",
            "GET",
            "synths",
            200,
            params={"search": "Vital"}
        )
        
        if success1 and isinstance(response1, list):
            serum_found = any('serum' in s.get('name', '').lower() for s in response1)
            print(f"   Serum search: {'✅ Found' if serum_found else '❌ Not found'}")
        
        if success2 and isinstance(response2, list):
            vital_found = any('vital' in s.get('name', '').lower() for s in response2)
            print(f"   Vital search: {'✅ Found' if vital_found else '❌ Not found'}")
        
        return success1 and success2

    def test_category_filter(self):
        """Test category filtering"""
        success, response = self.run_test(
            "Filter by Wavetable Category",
            "GET",
            "synths",
            200,
            params={"category": "wavetable"}
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} wavetable synths")
            # Verify all returned synths are wavetable category
            non_wavetable = [s for s in response if s.get('category') != 'wavetable']
            if non_wavetable:
                print(f"   ⚠️  Found {len(non_wavetable)} non-wavetable synths in wavetable filter")
            else:
                print(f"   ✅ All synths are correctly filtered as wavetable")
        return success

def main():
    print("🎹 Starting VST Synth API Tests...")
    print("=" * 50)
    
    # Setup
    tester = SynthAPITester()
    
    # Run tests in order
    print("\n📡 Testing API Connectivity...")
    tester.test_root_endpoint()
    
    print("\n🌱 Testing Database Seeding...")
    tester.test_seed_database()
    
    print("\n📋 Testing Synth Retrieval...")
    success, all_synths = tester.test_get_all_synths()
    
    print("\n🔍 Testing Filtering...")
    tester.test_filter_free_synths()
    tester.test_filter_paid_synths()
    tester.test_category_filter()
    
    print("\n🔎 Testing Search...")
    tester.test_search_functionality()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("❌ Some tests failed!")
        print("\nFailed tests:")
        for result in tester.test_results:
            if result["status"] == "FAIL":
                print(f"  - {result['test']}: {result['details']}")
        return 1

if __name__ == "__main__":
    sys.exit(main())