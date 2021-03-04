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
        static constexpr symbol tokenSymbol = symbol(symbol_code("CYFAR"), 3);

        // compensation tokens
        static constexpr name voucherTokenName = "voucher"_n;

        void handle_token_transfer(const name& from, const name& to, const name& category, const name& token_name, const asset& quantity, const std::string& memo);

        TABLE bonds_record {
            
            name founder;
            name category;
            asset available_bonds;
            
            uint64_t primary_key() const { return category.value; }
        };

        using bonds_tbl_type = multi_index<"bonds"_n, bonds_record>;
        bonds_tbl_type bonds_tbl;

    private:

        void handle_bond_transfers(const name& from, const name&category, const asset& quantity);
        void handle_donation_transfers(const name& from, const name& category, const asset& quantity);
};