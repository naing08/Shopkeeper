/**
 * Created by ChitSwe on 1/4/17.
 */

const PaginationHelper={
  getResult({db,baseQuery,attributes,page,pageSize,where,listKey,paranoid,include,order}){
      let offset = (page - 1) * pageSize;
      listKey = listKey? listKey : 'list';
      const query = baseQuery.findAll({limit:pageSize,offset:offset,where,attributes,paranoid,include,order});
      const rowCountQuery = baseQuery.findAll({raw:true,where,attributes:[[db.sequelize.fn('COUNT',db.sequelize.col('*')),'totalRows']],paranoid,include});
      return Promise.all([query,rowCountQuery]).then((results)=>{
          const totalRows = results[1][0].totalRows;
          const hasMore = page * pageSize <totalRows;
          let totalPages = totalRows? totalRows/pageSize:0;
          if(totalPages<1)
            totalPages = 0;
          if(totalRows%pageSize>0)
            totalPages++;
          return {
              page:page,
              currentPage:page,
              pageSize:pageSize,
              [listKey]:results[0],
              totalRows:totalRows,
              totalPages,
              hasMore
          }
      });
  }
};

export default PaginationHelper;