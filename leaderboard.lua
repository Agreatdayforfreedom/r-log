local KEY = KEYS[1]
local MEMBER = KEYS[2]
local SCORE = KEYS[3]


if redis.call('ZSCORE', KEY, MEMBER) == nil then 
	redis.call('ZADD', KEY,  SCORE,MEMBER)
else 
	redis.call('ZINCRBY', KEY,  SCORE, MEMBER)
end

return redis.call('ZRANGE', KEY, 0, 10, 'WITHSCORES')
