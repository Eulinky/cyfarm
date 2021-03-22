#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <cmath>
#include "cyfar.hpp"

using namespace eosio;

[[eosio::on_notify("eosio.token::transfer")]]
void cyfar::handle_donation(const name& donor,
                      const name& to,
                      const asset& quantity,
                      const std::string& memo)
{
    print("Donation trigger");

    require_auth(donor);

    if(to != "cyfar"_n) 
    {
        print("Unrelated token transfer");
        return;
    }

    bool isRefund = donor == get_self();
    if(isRefund)
        return;

    check(memo != std::string("null") && memo != "", "bond token category required in memo!");

    // get the token category from the memo
    auto category = name(memo);
    auto bondTokenQuantity = asset(quantity.amount / std::pow(10, quantity.symbol.precision()), tokenSymbol);
    
    //transfer the bond tokens from the market to the donor
    action(
        permission_level { get_self(), "active"_n },
        tokenAccount,
        "transferft"_n,
        std::make_tuple(
            get_self(),     // from
            donor,           // to
            category,       // category
            bondTokenName,  // token_name
            bondTokenQuantity,  // quantity
            std::string("Bonds in return for your donation. Thanks!")
        )
    ).send();

    // get the receiver from the bond token table
    stats_index stats_table(tokenAccount, category.value);
    const auto& dgood_stats = stats_table.get( bondTokenName.value, "No Bond token found for category and token_name does not exist" );

    //transfer the donated tokens from the market to the farmer
    action(
        permission_level { get_self(), "active"_n },
        "eosio.token"_n,
        "transfer"_n,
        std::make_tuple(
            get_self(),     // from
            dgood_stats.rev_partner, // to
            quantity,  // quantity
            std::string("Donation")
        )
    ).send();

    donation_tbl_type donation_table( get_self(), donor.value );
    const auto& itr = donation_table.find(category.value);
    if(itr == donation_table.end())
    {
        donation_table.emplace(get_self(), [&](auto& new_row)
        {
            new_row.donor = donor;
            new_row.category = category;
            new_row.amount = quantity;
        });
    }
    else
    {
        donation_table.modify(itr, get_self(), [&](auto &donation_row)
        {
            donation_row.amount += quantity;
        });
    }
}
