local LOBBY = KEYS[1] -- Set
local USER_ID = KEYS[2] -- String
local UUID = ARGV[1]

-- return member
redis.call('SADD', LOBBY, USER_ID)
if redis.call('SCARD', LOBBY) == 4 then
	local members = table.concat(redis.call('SMEMBERS', LOBBY), ",")
	redis.call('DEL', LOBBY) -- empty lobby
	local game_id = redis.sha1hex(members)
	redis.call('HSET', LOBBY..UUID, game_id, members)
	return {game_id, redis.call("HGET", LOBBY..UUID,game_id)}
end

 
return {redis.call("SCARD", LOBBY)}
