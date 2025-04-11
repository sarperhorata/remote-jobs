from enum import Enum

class WebsiteType(str, Enum):
    REMOTE_OK = "remote_ok"
    WE_WORK_REMOTELY = "we_work_remotely"
    REMOTE_CO = "remote_co"
    JOBS_FROM_SPACE = "jobs_from_space"
    REMOTIVE = "remotive"
    CUSTOM = "custom" 