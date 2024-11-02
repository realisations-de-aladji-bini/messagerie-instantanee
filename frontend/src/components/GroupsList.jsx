import '../css/GroupsList.css'

function GroupsList({title, groups, setSelectedGroup,type}){


    function handleGroupClick(group) {
        setSelectedGroup( [group,type])
    }

    return (
        <div className="groupListBox">
            <h5>{title}</h5>
            <ul className="groupList">
                {groups.minLength !== 0 ?
                    groups.map((group, indice) => (
                        <li key={indice} onClick={() => handleGroupClick(group)}> {(type=='member')?'💬':'👥'} {group.name} </li>
                    ))
                    : "Aucun élément"}
            </ul>
            <hr/>
        </div>
    )
}

export default GroupsList
