const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { groth16, plonk } = require("snarkjs");

function unstringifyBigInts(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return BigInt(o);
    } else if ((typeof(o) == "string") && (/^0x[0-9a-fA-F]+$/.test(o) ))  {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        if (o===null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = unstringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

describe("HelloWorld", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("HelloWorldVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2"}, "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm","contracts/circuits/HelloWorld/circuit_final.zkey");

        //log HelloWorld circuits out
        // publicSignals type conversion to integer
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        // proof type conversion to integer
        const editedProof = unstringifyBigInts(proof);
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
        // calldata split and type conversion to integer
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
        // get Input a
        const a = [argv[0], argv[1]];
        // get Input b
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        // get Input c
        const c = [argv[6], argv[7]];
        // get output
        const Input = argv.slice(8);

        // Execute validation Proof
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with Groth16", function () {

    beforeEach(async function () {
        //[assignment] insert your script here
        Verifier = await ethers.getContractFactory("Multiplier3Groth16Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2","c":"3"}, "contracts/circuits/Multiplier3-groth16/Multiplier3_js/Multiplier3.wasm","contracts/circuits/Multiplier3-groth16/circuit_multiplier3-groth16_final.zkey");

        //log HelloWorld circuits out

        const editedPublicSignals = unstringifyBigInts(publicSignals);
        const editedProof = unstringifyBigInts(proof);
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
    
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);

        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [3]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with PLONK", function () {

    beforeEach(async function () {
        //[assignment] insert your script here
        Verifier = await ethers.getContractFactory("Multiplier3PlonkVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here
        const { proof, publicSignals } = await plonk.fullProve({"a":"1","b":"2","c":"3"}, "contracts/circuits/Multiplier3-plonk/Multiplier3_js/Multiplier3.wasm", "contracts/circuits/Multiplier3-plonk/circuit_multiplier3-plonk.zkey");

        //log HelloWorld circuits out
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        const editedProof = unstringifyBigInts(proof);
        const calldata = await plonk.exportSolidityCallData(editedProof, editedPublicSignals);

        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => x.toString());
        const a = argv[0]
        const Input = [argv[1]];

        expect(await verifier.verifyProof(a, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
        let a = '0x223dfbf6f452a3e2a80d103a22b18795134088f6a64e36f18a4d528f00416f6b09d55daecfdfb5fe035a554787711d2e4f7b5f08fccec29771f4771d083911132c0a292be53df88af11c5b2622f26a39334391aec54b957ed73ef42e234605ec1c7033b1f637faf63ca56beddf76f172810c739f3b1ca19bfd13952e95289e7d10fb30a4bc383f4bf58c8e1552e7259334625a65bda1b8bae2d0e242e331f5461a2d34ab33c396218780ebefd475eb02a31878fa1f9921cd330e9f880614cc8728d8bc874eb6fc1744491d068c4667986eaf835b40d4c1f1c2eefb704020fdff007d0f363cda22aafce98d32e3c9e84510da56ee5fcf5af9ed03c8e60152d811077452b133c6737734637d2d9728835cd9195db69298a344dcb6eb1ebd9a143c2e70786749738aaa06cf1fd127bad47b4fa91536769115a9b8997dcf30d2de823052867654b6154574e4f9b824804bb19eeae08b61002bf529d6ccb7c8e51240005a12e9328e862b85874dd7e5693ed55080cd681a8f9e5fd4f0b550c4d01bff2c30dccdd2f6c1db470d5c53487474d614b4f8e7f3770d9c5ecbbcdad7efd94502d477aaf6d63da72d237a5c1a91c9bb7fcc3ce48a4674a4caebd938f8f883042ae541f2ce7ae85e917b592810dd9ee7f5904033bdc11059a92b354a815ea82c0b652a66358121836af64f98dacd2a7882abfff6705409eac749eb052df70b472e466ecaa6a2138449d4b755e2fb8b7a24432a79eaa62d17bca784bf4295cd530e8961d5d46eca051cc46ce19a4bf2b016bc074b910b6911ac8cf5fbc52a5dbb0141f31cc46e370a5d2a8670526c08889930157b6741100df1f309e0d5a771e1117b208ba5a17c66c62f24bcc86ce0c475b0bb851dfc0bf5425ed00b36aabd4f306421e9e91be88d02c6d701ddf712756dd66e814643f26113edcc63987ca8f113b734f3c5b988a08c1d49d40acd0852ec99d356823f845e9d966bfc3c284835026cf6407c91aa2580359d0683393c602a86bc9f0ef731ca9a87c887891dbdb8274afd33c874c51a3a8a75dcafc0cbfd23753f3f9862aa80d6aca3a965d57f1f28419f74911c3274e0208e8c67b3d39c7263a1ea705a1c6bbd72888ba0b00ba8';
        let d = [3]
        expect(await verifier.verifyProof(a, d)).to.be.false;
    });
});


describe("LessThan10 with Groth16", function () {

    beforeEach(async function () {
        //[assignment] insert your script here
        Verifier = await ethers.getContractFactory("LessThan10Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here
        const { proof, publicSignals } = await groth16.fullProve({"in":"5"}, "contracts/circuits/LessThan10/LessThan10_js/LessThan10.wasm","contracts/circuits/LessThan10/circuit_final.zkey");

        //log HelloWorld circuits out
        console.log("proof =", proof)
        console.log("publicSignals =", publicSignals)

        const editedPublicSignals = unstringifyBigInts(publicSignals);
        const editedProof = unstringifyBigInts(proof);
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
    
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);

        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
        // let a = [0, 0];
        // expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("RangeProof with Groth16", function () {

    beforeEach(async function () {
        //[assignment] insert your script here
        Verifier = await ethers.getContractFactory("RangeProofVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here
        const { proof, publicSignals } = await groth16.fullProve({"in":"5", "range":["0", "9"]}, "contracts/circuits/RangeProof/RangeProof_js/RangeProof.wasm","contracts/circuits/RangeProof/circuit_final.zkey");

        //log HelloWorld circuits out
        console.log("proof =", proof)
        console.log("publicSignals =", publicSignals)

        const editedPublicSignals = unstringifyBigInts(publicSignals);
        const editedProof = unstringifyBigInts(proof);
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
    
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);

        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
        // let a = [0, 0];
        // expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});