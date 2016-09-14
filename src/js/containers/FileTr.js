import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';

const FileTr = ({ node }) => (
  <tr>
    <td>{node.access}</td>
    <td>
      <Link to={{ pathname: `/files/${node.file_id}` }}>
        {node.file_name}
      </Link>
    </td>
    <td>{node.cases.length}</td>
    <td>{[...new Set(node.cases.map(c => c.project.project_id))]}</td>
    <td>{node.data_category}</td>
    <td>{node.data_format}</td>
    <td>{`${node.file_size}B`}</td>
  </tr>
);

export default Relay.createContainer(FileTr, {
  fragments: {
    node: () => Relay.QL`
      fragment on File {
        file_id
        file_name
        file_size
        access
        data_category
        data_format
        cases {
          project {
            project_id
          }
        }
      }
    `,
  },
});
