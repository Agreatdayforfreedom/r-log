local LOBBY = KEYS[1]
local USER_ID = KEYS[2]

if redis.call("EXISTS", LOBBY) == 0 then 
	redis.call("SADD", LOBBY, table.concat(USER_ID, "_OWNER"))
	return 1
end

return 0
