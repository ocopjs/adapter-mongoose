const { pipelineBuilder } = require("../src/lib/join-builder");
const { queryParser } = require("../src/lib/query-parser");
const { listAdapter } = require("./utils");

describe("Test main export", () => {
  test("throws if listAdapter is non-Object", async () => {
    expect(() =>
      queryParser({ listAdapter: undefined }, { name: "foobar" }),
    ).toThrow(Error);

    // Shouldn't throw
    await queryParser({ listAdapter }, { name: "foobar" });
  });

  test("runs the query", async () => {
    const query = {
      AND: [
        { name: "foobar" },
        { age: 23 },
        {
          posts_every: {
            AND: [{ title: "hello" }, { tags_some: { name: "foo" } }],
          },
        },
      ],
    };
    const queryTree = queryParser(
      { listAdapter, getUID: jest.fn((key) => key) },
      query,
    );
    const pipeline = pipelineBuilder(queryTree);
    expect(pipeline).toMatchObject([
      {
        $lookup: {
          from: "posts",
          as: "posts_every_posts",
          let: { tmpVar: `$_id` },
          pipeline: expect.arrayContaining([
            {
              $lookup: {
                from: "posts_tags",
                as: "tags_some_tags",
                let: { tmpVar: `$_id` },
                pipeline: expect.arrayContaining([
                  {
                    $lookup: {
                      from: "tags",
                      as: "tags_some_tags_0",
                      let: { tmpVar: "$Tag_id" },
                      pipeline: expect.arrayContaining([
                        { $match: { name: { $eq: "foo" } } },
                        { $addFields: { id: "$_id" } },
                        {
                          $project: {
                            posts: 0,
                          },
                        },
                        { $match: { $expr: { $eq: [`$_id`, "$$tmpVar"] } } },
                      ]),
                    },
                  },
                  {
                    $match: {
                      $expr: { $gt: [{ $size: "$tags_some_tags_0" }, 0] },
                    },
                  },
                  { $match: { $expr: { $eq: [`$Post_id`, "$$tmpVar"] } } },
                ]),
              },
            },
            {
              $match: {
                $and: [
                  { title: { $eq: "hello" } },
                  { $expr: { $gt: [{ $size: "$tags_some_tags" }, 0] } },
                ],
              },
            },
            { $addFields: { id: "$_id" } },
            { $project: { tags_some_tags: 0, posts: 0 } },
            { $match: { $expr: { $eq: [`$author`, "$$tmpVar"] } } },
          ]),
        },
      },
      {
        $lookup: {
          from: "posts",
          as: "posts_every_posts_all",
          let: { tmpVar: "$_id" },
          pipeline: expect.arrayContaining([
            { $match: { $expr: { $eq: [`$author`, "$$tmpVar"] } } },
          ]),
        },
      },
      {
        $match: {
          $and: [
            { name: { $eq: "foobar" } },
            { age: { $eq: 23 } },
            {
              $expr: {
                $eq: [
                  { $size: "$posts_every_posts" },
                  { $size: "$posts_every_posts_all" },
                ],
              },
            },
          ],
        },
      },
      { $addFields: { id: "$_id" } },
      { $project: { posts_every_posts: 0, posts_every_posts_all: 0 } },
    ]);
  });
});
