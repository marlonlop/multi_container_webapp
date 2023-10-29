const keys = require('./keys');
const redisClient = redis.createClient({
    host: keys.redisHost,
    host: keys.redisPort,
    retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

function fib(index) {
    //recursive
    if (index < 2) {
        return 1;
    }
    return fib(index - 1) + fib(index - 2);
}

function fibonacciDP(index) {
    //uses dynamic programming
    if (index < 2) return 1;
    var prev = 1;
    var cur = 1;
    for (let i = 2; i <= index; i++) {
        const tmp = cur;
        cur += prev;
        prev = tmp;
    };
    return cur;
}

sub.on('message', (channel, message) => {
    //hash set name 'values', key=message the value to calc fib, value=result of fib(message) calculation
    redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');