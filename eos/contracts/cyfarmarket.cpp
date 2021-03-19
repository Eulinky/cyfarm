#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <cmath>
#include "cyfarmarket.hpp"

using namespace eosio;

[[eosio::on_notify("eosio.token::transfer")]]
void cyfarmarket::handle_donation(const name& donor,
                      const name& to,
                      const asset& quantity,
                      const std::string& memo)
{
    print("Donation trigger");

    require_auth(donor);

    if(to != "cyfar.market"_n) 
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
    //auto bondTokenQuantity = asset(quantity.amount, tokenSymbol);

    print(bondTokenQuantity);

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
}

[[eosio::on_notify("cyfar.token::transferft")]]
void cyfarmarket::handle_token_transfer(const name& from,
                          const name& to,
                          const name& category,
                          const name& token_name,
                          const asset& quantity,
                          const std::string& memo)
{
    print("Transfer trigger");
    print(token_name.to_string());

    if(token_name == bondTokenName) 
    {
        handle_bond_transfers(from, category, quantity);
    }
    else if(token_name == donationTokenName)
    {
        handle_donation_transfers(from, category, quantity);
    }
}

void cyfarmarket::handle_bond_transfers(const name& from, const name&category, const asset& quantity) 
{
    bool isWithdrawal = from == get_self();

    const auto& itr = bonds_tbl.find(category.value);
    if(itr == bonds_tbl.end()) 
    {
        bonds_tbl.emplace(get_self(), [&](auto& new_row)
        {
            new_row.founder = from;
            new_row.category = category;
            new_row.available_bonds = quantity;
        });
    }
    else
    {
        bonds_tbl.modify(itr, get_self(), [&](auto &bond_row)
        {
            if(isWithdrawal)
                bond_row.available_bonds -= quantity;
            else
                bond_row.available_bonds += quantity;
        });
    }
}

void cyfarmarket::handle_donation_transfers(const name& from, const name& category, const asset& quantity) 
{
    if(from == get_self()) 
    {
        return; // maybe we should worry more about that?
    }

    print("Handling donation transfer");

    // in exchange for a donation we to transfer the equal amount of bonds to the donor 
    // which triggers handle_bond_transfers and updates the bonds table
    action(
        permission_level { get_self(), "active"_n },
        tokenAccount,
        "transferft"_n,
        std::make_tuple(
            get_self(),     // from
            from,           // to
            category,
            bondTokenName,  // token_name
            quantity,       // quantity
            std::string("Bonds in return for your donation. Thanks!")
        )
    ).send();
}