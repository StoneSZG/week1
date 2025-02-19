#!/bin/bash

# [assignment] create your own bash script to compile Multipler3.circom using PLONK below

cd contracts/circuits

mkdir Multiplier3-plonk

if [ -f ./powersOfTau28_hez_final_10.ptau ]; then
    echo "powersOfTau28_hez_final_10.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_10.ptau'
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_10.ptau
fi

echo "Compiling Multiplier3-plonk.circom..."

circom Multiplier3.circom --r1cs --wasm --sym -o Multiplier3-plonk
snarkjs r1cs info Multiplier3-plonk/Multiplier3.r1cs

snarkjs plonk setup Multiplier3-plonk/Multiplier3.r1cs powersOfTau28_hez_final_10.ptau Multiplier3-plonk/circuit_multiplier3-plonk.zkey
#snarkjs zkey contribute Multiplier3-plonk/circuit_multiplier3-plonk.zkey Multiplier3-plonk/circuit_multiplier3-plonk_final.zkey --name="circuit multiplier3 plonk" -v -e="random text circuit multiplier3 plonk"
snarkjs zkey export verificationkey Multiplier3-plonk/circuit_multiplier3-plonk.zkey Multiplier3-plonk/circuit_multiplier3-plonk_key.json
snarkjs zkey export solidityverifier Multiplier3-plonk/circuit_multiplier3-plonk.zkey ../Multiplier3-plonk.sol

cd ../..