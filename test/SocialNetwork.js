const { assert } = require('chai')

const SocialNetwork = artifacts.require('./SocialDevelop.sol')
require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('SocialNetwork',([deployer,author,tipper]) => {
    let socialNetwork
    before(async ()=> {
        socialNetwork = await SocialNetwork.deployed()
    })
    describe('deployment',async () => {
        it('deploys succesfully',async () => {
        socialNetwork = await SocialNetwork.deployed()
        const address = await socialNetwork.address
        assert.notEqual(address,0x0)
        assert.notEqual(address,'')
        assert.notEqual(address,null)
        assert.notEqual(address,undefined)
    })
    it ('has a name', async() => {
        const name = await socialNetwork.name()
        assert.equal(name,'Giulian Social Network')
    })   
})
    describe('post', async() => {
        let result,postCount

        before(async ()=> {
            result = await socialNetwork.createPost('this is my first post',{from: author})
            postCount = await socialNetwork.postcount()
        })

        it('creates post',async() => {
            //Sucess
            assert.equal(postCount,1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(),postCount.toNumber(),'id is correct')
            assert.equal(event.content,'this is my first post','id is correct')
            assert.equal(event.tipamount,'0','tip amount is correct')
            assert.equal(event.author,author,'id is correct')
            //Failure
            await  socialNetwork.createPost('',{from: author}).should.be.rejected
        })
        it('list post',async() => {
            const post =  await socialNetwork.posts(postCount)
            assert.equal(post.id.toNumber(),postCount.toNumber(),'id is correct')
            assert.equal(post.content,undefined,'content is correct')
            assert.equal(post.tipamount,'0','tip amount is correct')
            assert.equal(post.author,author,'id is correct')
        })
        it('allow users to tip post',async() => {
            // Track author balnace before tip
            let oldAuthorBalance
            oldAuthorBalance = await web3.eth.getBalance(author)
            oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)
            // Review event
            result = await socialNetwork.tipPost(postCount,{from: tipper,value: web3.utils.toWei('1','Ether')})
            const event = result.logs[0].args
            // Success
            assert.equal(event.id.toNumber(),postCount.toNumber(),'id is correct')
            assert.equal(event.content,'this is my first post','id is correct')
            assert.equal(event.tipamount,'1000000000000000000','tip amount is correct')
            assert.equal(event.author,author,'id is correct')
            //Check author balaance after tip
            let newAuthorBalance
            newAuthorBalance = await web3.eth.getBalance(author)
            newAuthorBalance = new web3.utils.BN(newAuthorBalance)
            let tipAmount 
            tipAmount = web3.utils.toWei('1','Ether')
            tipAmount = new web3.utils.BN(tipAmount)

            const expectedBalance = oldAuthorBalance.add(tipAmount)

            assert.equal(newAuthorBalance.toString(),expectedBalance.toString())
            // Failure: Tries tip post that does not exist
            await socialNetwork.tipPost(99,{from:tipper,value:web3.utils.toWei('1','Ether')}).should.be.rejected

        })
        
    })
})    
