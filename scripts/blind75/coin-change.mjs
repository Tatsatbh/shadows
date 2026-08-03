import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

export default {
  question_number: 20,
  title: 'Coin Change',
  difficulty: 'Medium',
  question_uri: 'coin-change',
  summary: 'Make up an amount with the fewest coins from unlimited supplies of given denominations.',

  description_md: `You are given an integer array \`coins\` of coin denominations and an integer \`amount\`.

Return the **fewest number of coins** needed to make up \`amount\`. If the amount cannot be made up by any combination of the coins, return \`-1\`.

You have an **infinite** number of each denomination.

---

**Example 1**
\`\`\`text
Input: coins = [1,2,5], amount = 11
Output: 3
Explanation: 11 = 5 + 5 + 1
\`\`\`

**Example 2**
\`\`\`text
Input: coins = [2], amount = 3
Output: -1
Explanation: 3 cannot be made from 2s alone.
\`\`\`

**Example 3**
\`\`\`text
Input: coins = [1], amount = 0
Output: 0
Explanation: Zero coins are needed to make zero.
\`\`\`

## Constraints

- \`1 <= coins.length <= 12\`
- \`1 <= coins[i] <= 2^31 - 1\`
- \`0 <= amount <= 10^4\`
- A greedy "take the largest coin first" strategy does **not** work in general.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _coins = _pints(_ls[0] if len(_ls) > 0 else "")
    _amount = _pint(_ls[1] if len(_ls) > 1 else "0")
    print(Solution().coinChange(_coins, _amount))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<int> coins = _pints(ls[0]);
    int amount = _pint(ls[1]);

    Solution sol;
    cout << sol.coinChange(coins, amount) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        INF = amount + 1
        dp = [0] + [INF] * amount
        for target in range(1, amount + 1):
            for c in coins:
                if c <= target and dp[target - c] + 1 < dp[target]:
                    dp[target] = dp[target - c] + 1
        return -1 if dp[amount] >= INF else dp[amount]`,
    cpp: `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        const int INF = amount + 1;
        vector<int> dp(amount + 1, INF);
        dp[0] = 0;
        for (int target = 1; target <= amount; target++) {
            for (size_t k = 0; k < coins.size(); k++) {
                long long c = coins[k];
                if (c <= target && dp[target - (int)c] + 1 < dp[target]) {
                    dp[target] = dp[target - (int)c] + 1;
                }
            }
        }
        return dp[amount] >= INF ? -1 : dp[amount];
    }
};`,
  },

  // Greedy largest-coin-first: right on [1,2,5] but wrong on [186,419,83,408].
  wrong: {
    python: `class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        used = 0
        for c in sorted(coins, reverse=True):
            while amount >= c:
                amount -= c
                used += 1
        return used if amount == 0 else -1`,
    cpp: `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> sorted_coins = coins;
        sort(sorted_coins.rbegin(), sorted_coins.rend());
        int used = 0;
        for (size_t i = 0; i < sorted_coins.size(); i++) {
            while (amount >= sorted_coins[i]) {
                amount -= sorted_coins[i];
                used++;
            }
        }
        return amount == 0 ? used : -1;
    }
};`,
  },

  visible: [
    'coins = [1,2,5]\namount = 11',
    'coins = [2]\namount = 3',
    'coins = [1]\namount = 0',
    'coins = [1,2,5]\namount = 100',
  ],

  hidden: [
    'coins = [2,5,10,1]\namount = 27',
    'coins = [186,419,83,408]\namount = 6249',
    'coins = [1]\namount = 1',
    'coins = [1]\namount = 2',
    'coins = [5]\namount = 5',
    'coins = [3,7]\namount = 5',
    'coins = [1,5,10,25]\namount = 63',
    'coins = [411,412,413,414,415,416,417,418,419,420,421,422]\namount = 9864',
  ],
}
