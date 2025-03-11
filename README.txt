Folder: backend
Description: Contains all the code for the backend API.
Components: Docker compose setup for the FastAPI container
    and the PostgreSQL database schemas. Also login and
    CRUD code for task data. Private and public key data
    for JWT authentication is also in the backend/ directory.
Subdirectories: routers, testcases, utils, monitoring

Folder: backend/routers
Description: Contains API paths below root / path for FastAPI.
Components: API paths for task query and editing and user signup
    and logins.

Folder: backend/testcases
Description: Contains testcases for our backend API paths.

Folder: backend/utils
Description: Contain code to detect cycling dependencies in tasks database.

Folder: backend/monitoring
Descrition: Code to monitor and alert the backend apis and database, also include logging functionalities (avereage api latency, peak user number, average user number)
