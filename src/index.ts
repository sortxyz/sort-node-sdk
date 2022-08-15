import packageJson from "../package.json";
import axios, { AxiosError } from "axios";

const SORT_API_KEY = "API-KEY";
const SORT_NAMESPACE = "NAMESPACE";
const DEFAULT_NAMESPACE = "ethereum_latest";

class Sort {
  private sortApiKey: string;
  private sortNamespace: string;
  private debug: boolean;

    /**
     * Initialize Sort 
     *
     *   @param {string} sortApiKey (required)
     *   @param {string} sortNamespace (optional)
     *   @param {boolean} debug (optional)
     *
     */
    constructor(config: any) {
        console.log("[SORT] Initializing Sort");

        if (!config) {
            throw new Error(
                "[SORT] Failed to initialize Sort: config not provided"
            );
        }

        this.sortApiKey = config.api_key;
        this.sortNamespace = config.namespace;
        this.debug = config.debug;
        if (this.debug) {
            console.log("[SORT] Starting Sort with debug enabled");
        }

        if (!this.sortApiKey) {
            throw new Error(
                "[SORT] Failed to initialize Sort: api_key not provided"
            );
        }

        if (!this.sortNamespace) {
            this.sortNamespace = DEFAULT_NAMESPACE;
            console.log("[SORT] Default namespace specified (ethereum_latest), 7 days of decoded transactions available");
        } else {
            console.log("[SORT] "+this.sortNamespace+" namespace specified");
        }
    }

    query = async(sql: string) => {
        let response = null;

        if (this.debug) {
            console.log("[SORT] Executing query: " + sql);
        }

        try {
            var sortxyz_sql_result = await axios.post('https://api.sort.xyz/v0/sql',
                {
                "query": sql,
                "api_key": this.sortApiKey
                }
            );
            
            if (sortxyz_sql_result && sortxyz_sql_result.data) {
                if (!sortxyz_sql_result.data.query_response && 
                    sortxyz_sql_result.data.success == 0) {
                    console.log("[SORT] Please ensure a valid API key");
                    response = "Please ensure a valid API key";
                } else {
                    response = sortxyz_sql_result.data.query_response.results;
                }
            } 
        } catch (e) {
            throw new Error(
                "[SORT] " + e
            );
        }
        
        return response;
    }

    queryById = async(queryid: string) => {
        let response = null;

        if (this.debug) {
            console.log("[SORT] Executing query with id: " + queryid + " (see results at https://sort.xyz/query/" + queryid + ")");
        }

        try {
            var sortxyz_sql_result = await axios.get("https://api.sort.xyz/v0/queries/"+queryid+"/json");

            response = sortxyz_sql_result.data;

            // if results are empty, log a message 
            if (!response || response.length == 0) {
                console.log("[SORT] 0 results: please test query at sort.xyz");
            }
        } catch (e) {
            throw new Error(
                "[SORT] " + e
            );
        }
        
        return response;
    }

    transaction = async(transaction_hash: string) => {
        let sql = "select * from " + this.sortNamespace + ".transaction t where t._id = '"+transaction_hash+"' limit 1";
        let response = await this.query(sql);
        return response;
    }

    transactionEvents = async(transaction_hash: string) => {
        let sql = "select * from " + this.sortNamespace + ".transaction_log l where l.transaction_hash = '"+transaction_hash+"' order by index desc";
        let response = await this.query(sql);
        return response;
    }

    contractEvents = async (contract_address: string, limit: number = 100) => {
        let sql = "select * from " + this.sortNamespace + ".transaction_log l where l.function_address = '"+contract_address+"' order by timestamp desc limit " + limit;
        let response = await this.query(sql);
        return response;
    }

    contractTransactions = async (contract_address: string, limit: number = 100) => {
        let sql = "select * from " + this.sortNamespace + ".transaction t where t.to = '"+contract_address+"' order by timestamp desc limit " + limit;
        let response = await this.query(sql);
        return response;
    }
}

export { Sort };