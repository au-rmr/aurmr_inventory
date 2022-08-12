interface ItemProps {
    amazonProductName: string,
}

function Item ({amazonProductName}: ItemProps) {
    return(
        <p>{amazonProductName}</p> 
    )
} 

export default Item;