const fs = require("fs");
const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/

const verifierRegex = /contract Verifier/

let content = fs.readFileSync("./contracts/HelloWorldVerifier.sol", { encoding: 'utf-8' });
let bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0');
bumped = bumped.replace(verifierRegex, 'contract HelloWorldVerifier');

fs.writeFileSync("./contracts/HelloWorldVerifier.sol", bumped);

// [assignment] add your own scripts below to modify the other verifier contracts you will build during the assignment

let multiplier3_groth16_content = fs.readFileSync("./contracts/Multiplier3-groth16.sol", { encoding: 'utf-8' });
let multiplier3_groth16_bumped = multiplier3_groth16_content.replace(solidityRegex, 'pragma solidity ^0.8.0');
multiplier3_groth16_bumped = multiplier3_groth16_bumped.replace(verifierRegex, 'contract Multiplier3Groth16Verifier');

fs.writeFileSync("./contracts/Multiplier3-groth16.sol", multiplier3_groth16_bumped);

const plonkVerifierRegex = /contract PlonkVerifier/
let multiplier3_plonk_content = fs.readFileSync("./contracts/Multiplier3-plonk.sol", { encoding: 'utf-8' });
let multiplier3_plonk_bumped = multiplier3_plonk_content.replace(solidityRegex, 'pragma solidity ^0.8.0');
multiplier3_plonk_bumped = multiplier3_plonk_bumped.replace(plonkVerifierRegex, 'contract Multiplier3PlonkVerifier');

fs.writeFileSync("./contracts/Multiplier3-plonk.sol", multiplier3_plonk_bumped);


let lessThen10Content = fs.readFileSync("./contracts/LessThan10Verifier.sol", { encoding: 'utf-8' });
let lessThen10bumped = lessThen10Content.replace(solidityRegex, 'pragma solidity ^0.8.0');
lessThen10bumped = lessThen10bumped.replace(verifierRegex, 'contract LessThan10Verifier');

fs.writeFileSync("./contracts/LessThan10Verifier.sol", lessThen10bumped);

let rangeProofContent = fs.readFileSync("./contracts/RangeProofVerifier.sol", { encoding: 'utf-8' });
let rangeProofbumped = rangeProofContent.replace(solidityRegex, 'pragma solidity ^0.8.0');
rangeProofbumped = rangeProofbumped.replace(verifierRegex, 'contract RangeProofVerifier');

fs.writeFileSync("./contracts/RangeProofVerifier.sol", rangeProofbumped);