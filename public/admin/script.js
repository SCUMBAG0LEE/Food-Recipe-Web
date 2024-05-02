function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        fetch(`/admin-dashboard/delete/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                document.getElementById(`deleteForm_${userId}`).parentNode.remove(); // Remove the row from the table
                return response.json();
            } else {
                throw new Error('Failed to delete user');
            }
        })
        .then(data => {
            alert(data.message); // Show success message
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        });
    }
}



