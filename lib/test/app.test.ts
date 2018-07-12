import deepEqual from "deep-equal";
import "whatwg-fetch";
import { ContractCall, fetchContract } from "../services/ContractExecutor";
import { listLoans } from "../services/listLoans";
import { Loan } from "../services/Loan";
import { Result } from "../services/Result";


const standardFNMALoan: Loan = {
  borrowers: [],
  contactAddress: "1, Main Street, SmallTown, KY",
  contactPhoneNumber1: "0123456789",
  contactPhoneNumber2: "0123456789",
  current: true,
  customIds: [
    ["Wells Fargo", "LouisvilleKY_22182000xaq1"],
    ["Selene", "mmmm2233"]
  ],
  mortgagee: "James Brown",
  mortgageeAddress: "1, Main Street, SmallTown, KY",
  noteAmount: 125000,
  noteRate:
  {
    denominator: 100,
    numerator: 3,
  },
  term: 240,
}

const listLoansCall: ContractCall<void> = { contractName: "loan", contractVersion: "1.0.0", contractFunction: "list_loans" };

const mockLoanFetcher = (cannedResult: Result<Loan[]>) => async (call: ContractCall<void>) => {
  if (deepEqual(call, listLoansCall)) {
    return Promise.resolve(cannedResult);
  } else {
    return Promise.reject(new Error("unexpected contract call : " + JSON.stringify(call)));
  }
};

describe("List loans", () => {
  test("returns empty given fetcher returns empty", async () => {
    const res = await listLoans(mockLoanFetcher([]));
    expect(res).toEqual([]);
  });

  test("returns whatever fetcher returns", async () => {
    const res = await listLoans(mockLoanFetcher([standardFNMALoan]));
    expect(res).toEqual([standardFNMALoan]);
  });
});

const mockResponse = (status: number, statusText: string, response: string) => {
  return new Response(response, {
    headers: {
      'Content-type': 'application/json'
    },
    status,
    statusText,
  });
};

describe("Contract Call w/ Fetch", () => {
  it("calls /contracts/sync/call endpoint on URL with given contract definition", async () => {
    const fetch = jest.fn().mockImplementation((url) => {
      if (url === "https://api.rexservicing.com/contracts/sync/call/loan/1.0.0/list_loans") {
        return Promise.resolve(mockResponse(200, "OK", JSON.stringify([standardFNMALoan])));
      } else {
        return Promise.reject("unexpected url : " + url);
      }
    });

    const res = await fetchContract({ contractURL: "https://api.rexservicing.com", authorization: "Basic XXXXXX" }, fetch)(listLoansCall);

    expect(res).toEqual([standardFNMALoan]);
    expect(fetch).toBeCalled();
  })
})