pragma solidity 0.5.0;

contract  SocialDevelop {
    string public name;
    uint public postcount = 0;
    mapping(uint => Post) public posts;
    struct Post{
        uint id;
        string _content;
        uint   tipamount;
        address payable author;
    }
    event PostCreated(
        uint id,
        string content,
        uint tipamount,
        address payable author
    );
        event PostTipped(
        uint id,
        string content,
        uint tipamount,
        address payable author
    );
    constructor() public {
        name = "Giulian Social Network";
    }
    function createPost(string memory _content) public  {
        //Require valid Content
        require(bytes(_content).length > 0);
        // Increment postcount
        postcount ++;
        posts[postcount] = Post(postcount,_content,0,msg.sender);
        //Trigger Events
        emit PostCreated(postcount,_content,0,msg.sender);
    }
        function tipPost(uint _id) public payable {
        //Require id exist for  Content tip
        require(_id > 0 && _id <= postcount);
        //Fetch the post
        Post memory _post  = posts[_id];
        // Fetch the owner of the post
        address payable _author = _post.author;
        //Pay the author
        address(_author).transfer(msg.value);
        //Increment Tip Amount
        _post.tipamount = _post.tipamount + msg.value;
        //Update post
        posts[_id] = _post;
        //Trigger an Event
        emit PostTipped(postcount,_post._content, _post.tipamount, _author);
    }
}

