import { graphql } from "@octokit/graphql";
import { useEffect, useState } from "react";
import './App.css';

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
  },
});

function App() {
  const [discussions, setDiscussions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const getAgoraStates = async () => {
    const { repository } = await graphqlWithAuth(`
      {
        repository(owner: "codestates-seb", name: "agora-states-fe") {
          discussions(last: 3) {
            edges {
              node {
                author {
                  avatarUrl
                  login
                }
                title
                updatedAt
                url
              }
            }
          }
        }
      }
    `);

    return repository
  }

  useEffect(() => {
    getAgoraStates()
      .then((repo)=>{
        setDiscussions(repo.discussions.edges)
      })
      .catch((err)=>{
        console.log(err)
      })
  }, [])

  return (
    <div className="App">
      <ul>
        {discussions.map((el) => 
          <li>
              <div>{el.node.title}</div>
          </li>
        )}
      </ul>
    </div>
  );
}

export default App;
