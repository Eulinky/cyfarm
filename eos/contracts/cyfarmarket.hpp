#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>

using namespace eosio;

class [[eosio::contract("cyfarmarket")]] cyfarmarket : public contract
{
    public:

        using contract::contract;

        cyfarmarket (name receiver, name code, datastream<const char*> ds) :
            contract(receiver, code, ds),
            bonds_tbl(get_self(), get_self().value)
            {}

        static constexpr name marketAccount = "cyfar.market"_n;
        static constexpr name tokenAccount = "cyfar.token"_n;

        static constexpr name bondTokenName = "bond"_n;
        static constexpr name donationTokenName = "donation"_n;
        static constexpr symbol tokenSymbol = symbol(symbol_code("CYFAR"), 0);

        // compensation tokens
        static constexpr name voucherTokenName = "voucher"_n;

        void handle_donation(const name& from, const name& to, const asset& quantity, const std::string& memo);
        void handle_token_transfer(const name& from, const name& to, const name& category, const name& token_name, const asset& quantity, const std::string& memo);

        TABLE bonds_record {
            
            name founder;
            name category;
            asset available_bonds;
            
            uint64_t primary_key() const { return category.value; }
        };

        using bonds_tbl_type = multi_index<"bonds"_n, bonds_record>;
        bonds_tbl_type bonds_tbl;

        TABLE dgoodstats {
            bool           fungible;
            bool           burnable;
            bool           sellable;
            bool           transferable;
            name           issuer;
            name           rev_partner;
            name           token_name;
            uint64_t       category_name_id;
            asset          max_supply;
            time_point_sec max_issue_window;
            asset          current_supply;
            asset          issued_supply;
            double         rev_split;
            std::string    base_uri;

            uint64_t primary_key() const { return token_name.value; }
        };

        using stats_index = multi_index< "dgoodstats"_n, dgoodstats>;

    private:

        void handle_bond_transfers(const name& from, const name&category, const asset& quantity);
        void handle_donation_transfers(const name& from, const name& category, const asset& quantity);
};